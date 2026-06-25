# Guía de Implementación: Pagos entre Usuarios con Payoneer

## Resumen

Esta implementación permite que los usuarios de tu aplicación SplitMe envíen y reciban pagos entre sí utilizando sus cuentas de Payoneer. Las transferencias entre usuarios de Payoneer son **gratuitas** y se procesan en **2 horas típicamente**.

## Requisitos Previos

1. **Cuenta de Payoneer Business** para tu aplicación
2. **Acceso a la API de Payoneer** (Mass Payout & Services API)
3. **Credenciales de API**: Client ID y Client Secret
4. **Webhooks configurados** para recibir notificaciones

## Configuración del Backend

### 1. Variables de Entorno

```env
PAYONEER_CLIENT_ID=your_client_id
PAYONEER_CLIENT_SECRET=your_client_secret
PAYONEER_API_URL=https://api.sandbox.payoneer.com  # o production
PAYONEER_WEBHOOK_SECRET=your_webhook_secret
```

### 2. Estructura de Base de Datos

```sql
-- Tabla para cuentas de Payoneer vinculadas
CREATE TABLE payoneer_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    payoneer_email VARCHAR(255) NOT NULL,
    payoneer_account_id VARCHAR(100),
    is_verified BOOLEAN DEFAULT FALSE,
    is_linked BOOLEAN DEFAULT TRUE,
    account_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para solicitudes de pago
CREATE TABLE payment_requests (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    payoneer_payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- Tabla para historial de pagos
CREATE TABLE payment_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    type VARCHAR(10) NOT NULL, -- 'sent' o 'received'
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    description TEXT,
    status VARCHAR(50) NOT NULL,
    payoneer_transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Endpoints de la API

#### 3.1 Vincular Cuenta de Payoneer

```javascript
// POST /api/v1/payoneer/link-account
app.post("/api/v1/payoneer/link-account", authenticateUser, async (req, res) => {
  try {
    const { payoneerEmail, payoneerAccountId } = req.body;
    const userId = req.user.id;

    // Verificar si el email ya está vinculado
    const existingAccount = await PayoneerAccount.findOne({
      payoneer_email: payoneerEmail,
    });

    if (existingAccount && existingAccount.user_id !== userId) {
      return res.status(400).json({
        message: "Este email de Payoneer ya está vinculado a otra cuenta",
      });
    }

    // Crear o actualizar cuenta vinculada
    const account = await PayoneerAccount.upsert({
      user_id: userId,
      payoneer_email: payoneerEmail,
      payoneer_account_id: payoneerAccountId,
      account_status: "pending",
    });

    res.json({
      message: "Cuenta vinculada exitosamente",
      account,
    });
  } catch (error) {
    res.status(500).json({ message: "Error vinculando cuenta", error });
  }
});
```

#### 3.2 Obtener Información de Cuenta

```javascript
// GET /api/v1/payoneer/account
app.get("/api/v1/payoneer/account", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id;

    const account = await PayoneerAccount.findOne({ user_id: userId });

    if (!account) {
      return res.json({ account: null });
    }

    res.json({ account });
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo cuenta", error });
  }
});
```

#### 3.3 Enviar Pago

```javascript
// POST /api/v1/payoneer/send-payment
app.post("/api/v1/payoneer/send-payment", authenticateUser, async (req, res) => {
  try {
    const { toUserEmail, amount, currency, description } = req.body;
    const fromUserId = req.user.id;

    // Verificar cuenta del remitente
    const senderAccount = await PayoneerAccount.findOne({
      user_id: fromUserId,
      is_verified: true,
    });

    if (!senderAccount) {
      return res.status(400).json({
        message: "Tu cuenta de Payoneer no está verificada",
      });
    }

    // Buscar usuario destinatario
    const recipientAccount = await PayoneerAccount.findOne({
      payoneer_email: toUserEmail,
      is_verified: true,
    });

    if (!recipientAccount) {
      return res.status(400).json({
        message: "Usuario destinatario no encontrado o no verificado",
      });
    }

    // Usar Payoneer API para enviar el pago
    const payoneerPayment = await sendPayoneerToPayoneerPayment({
      senderEmail: senderAccount.payoneer_email,
      recipientEmail: toUserEmail,
      amount,
      currency,
      description,
    });

    // Crear registro de pago
    const payment = await PaymentRequest.create({
      from_user_id: fromUserId,
      to_user_id: recipientAccount.user_id,
      amount,
      currency,
      description,
      status: "completed",
      payoneer_payment_id: payoneerPayment.id,
      completed_at: new Date(),
    });

    // Crear entradas en historial
    await Promise.all([
      PaymentHistory.create({
        user_id: fromUserId,
        type: "sent",
        amount,
        currency,
        description,
        status: "completed",
        payoneer_transaction_id: payoneerPayment.id,
      }),
      PaymentHistory.create({
        user_id: recipientAccount.user_id,
        type: "received",
        amount,
        currency,
        description,
        status: "completed",
        payoneer_transaction_id: payoneerPayment.id,
      }),
    ]);

    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: "Error enviando pago", error });
  }
});
```

#### 3.4 Solicitar Pago

```javascript
// POST /api/v1/payoneer/request-payment
app.post("/api/v1/payoneer/request-payment", authenticateUser, async (req, res) => {
  try {
    const { toUserEmail, amount, currency, description, dueDate } = req.body;
    const fromUserId = req.user.id;

    // Buscar usuario destinatario
    const recipientAccount = await PayoneerAccount.findOne({
      payoneer_email: toUserEmail,
    });

    if (!recipientAccount) {
      return res.status(400).json({
        message: "Usuario no encontrado",
      });
    }

    // Crear solicitud de pago
    const request = await PaymentRequest.create({
      from_user_id: fromUserId,
      to_user_id: recipientAccount.user_id,
      amount,
      currency,
      description,
      due_date: dueDate,
      status: "pending",
    });

    // Enviar notificación por email (opcional)
    await sendPaymentRequestNotification(recipientAccount.payoneer_email, {
      requesterName: req.user.name,
      amount,
      currency,
      description,
      requestId: request.id,
    });

    res.json({ request });
  } catch (error) {
    res.status(500).json({ message: "Error creando solicitud", error });
  }
});
```

### 4. Funciones de Utilidad para Payoneer API

```javascript
// utils/payoneerApi.js
const axios = require("axios");

class PayoneerAPI {
  constructor() {
    this.baseURL = process.env.PAYONEER_API_URL;
    this.clientId = process.env.PAYONEER_CLIENT_ID;
    this.clientSecret = process.env.PAYONEER_CLIENT_SECRET;
  }

  async getAccessToken() {
    // Implementar OAuth2 flow para obtener token de acceso
    const response = await axios.post(`${this.baseURL}/oauth2/token`, {
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    return response.data.access_token;
  }

  async sendPayoneerToPayoneerPayment({
    senderEmail,
    recipientEmail,
    amount,
    currency,
    description,
  }) {
    const token = await this.getAccessToken();

    // Usar Request Payment API de Payoneer
    const response = await axios.post(
      `${this.baseURL}/v2/payments/request`,
      {
        intent: "capture",
        payer: {
          payment_method: "payoneer",
          email: senderEmail,
        },
        payee: {
          email: recipientEmail,
        },
        amount: {
          total: amount.toString(),
          currency: currency,
        },
        description: description,
      },
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  }

  async getAccountBalance(payoneerEmail) {
    const token = await this.getAccessToken();

    const response = await axios.get(`${this.baseURL}/v2/accounts/balance`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Payoneer-Account": payoneerEmail,
      },
    });

    return response.data;
  }
}

module.exports = new PayoneerAPI();
```

### 5. Webhooks

```javascript
// POST /webhooks/payoneer
app.post("/webhooks/payoneer", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const signature = req.headers["payoneer-signature"];
    const payload = req.body;

    // Verificar firma del webhook
    if (!verifyPayoneerSignature(payload, signature)) {
      return res.status(401).send("Unauthorized");
    }

    const event = JSON.parse(payload);

    switch (event.type) {
      case "PAYMENT_COMPLETED":
        await handlePaymentCompleted(event.data);
        break;
      case "PAYMENT_FAILED":
        await handlePaymentFailed(event.data);
        break;
      case "ACCOUNT_VERIFIED":
        await handleAccountVerified(event.data);
        break;
      default:
        console.log("Unhandled webhook event:", event.type);
    }

    res.status(200).send("OK");
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).send("Error");
  }
});

async function handlePaymentCompleted(data) {
  // Actualizar estado del pago en la base de datos
  await PaymentRequest.update(
    { status: "completed", completed_at: new Date() },
    { where: { payoneer_payment_id: data.payment_id } },
  );
}

async function handleAccountVerified(data) {
  // Actualizar estado de verificación de la cuenta
  await PayoneerAccount.update(
    { is_verified: true, account_status: "approved" },
    { where: { payoneer_email: data.email } },
  );
}
```

## Consideraciones de Seguridad

1. **Validación de entrada**: Siempre validar y sanitizar datos de entrada
2. **Autenticación**: Verificar que el usuario esté autenticado para todas las operaciones
3. **Autorización**: Verificar que el usuario solo puede acceder a sus propios datos
4. **Webhooks**: Verificar firmas de webhooks para evitar ataques
5. **Logs**: Registrar todas las transacciones para auditoría

## Testing

### Datos de Prueba (Sandbox)

```javascript
// Usuarios de prueba para sandbox
const testUsers = {
  sender: {
    email: "sender@example.com",
    payoneerEmail: "sender@payoneer-test.com",
  },
  recipient: {
    email: "recipient@example.com",
    payoneerEmail: "recipient@payoneer-test.com",
  },
};

// Números de tarjeta de prueba
const testCards = {
  success: "4111111111111111",
  decline: "4000000000000002",
};
```

## Monitoreo y Métricas

1. **Transacciones exitosas vs fallidas**
2. **Tiempo promedio de procesamiento**
3. **Volumen de transacciones por día/mes**
4. **Usuarios activos con cuentas vinculadas**
5. **Errores de API más comunes**

## Próximos Pasos

1. Implementar los endpoints del backend
2. Configurar webhooks de Payoneer
3. Integrar con el frontend existente
4. Realizar pruebas en sandbox
5. Configurar monitoreo y alertas
6. Desplegar a producción

## Recursos Adicionales

- [Documentación oficial de Payoneer API](https://developer.payoneer.com)
- [Términos y condiciones de Payoneer](https://www.payoneer.com/legal/terms-conditions/)
- [Centro de ayuda para desarrolladores](https://payoneer.custhelp.com/)
