# SplitMe - Plataforma de Gestión Musical con Pagos Payoneer

SplitMe es una aplicación web moderna para gestión musical que permite a los usuarios administrar sus canciones, colaboradores y regalías, con una integración completa de pagos entre usuarios utilizando Payoneer.

## 🚀 Características Principales

### 🎵 Gestión Musical
- **Dashboard completo** con métricas de streaming y ingresos
- **Gestión de canciones** con información detallada y metadatos
- **Administración de colaboradores** y distribución de regalías
- **Historial de pagos** y seguimiento de transacciones
- **Integración con plataformas** como Spotify, Apple Music, etc.

### 💰 Pagos entre Usuarios con Payoneer
- **Transferencias gratuitas** entre usuarios con cuentas Payoneer
- **Envío de pagos instantáneos** (procesamiento en ~2 horas)
- **Solicitudes de pago** con fechas límite y descripciones
- **Historial completo** de transacciones enviadas y recibidas
- **Gestión de múltiples monedas** (USD, EUR, GBP)
- **Dashboard integrado** para balance y estado de cuenta

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** para desarrollo y build rápido
- **Tailwind CSS** para estilos modernos
- **Framer Motion** para animaciones fluidas
- **Lucide React** para iconografía
- **Axios** para peticiones HTTP

### Backend (Requerido)
- **Node.js/Express** o framework de tu elección
- **Base de datos** (PostgreSQL recomendado)
- **Integración con Payoneer API** (Mass Payout & Services)
- **Sistema de autenticación** JWT

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- Cuenta de Payoneer Business (para integración)

### Configuración Frontend

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/splitme.git
cd splitme

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

### Variables de Entorno

```env
VITE_URL_API=http://localhost:3000
VITE_PAYONEER_API_URL=https://api.sandbox.payoneer.com
```

### Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🔧 Configuración de Payoneer

Para habilitar los pagos entre usuarios, necesitas:

1. **Cuenta Payoneer Business** activa
2. **Acceso a Mass Payout & Services API**
3. **Credenciales de API** (Client ID y Client Secret)
4. **Configuración de webhooks** para notificaciones

Ver la [Guía de Implementación de Payoneer](./PAYONEER_IMPLEMENTATION_GUIDE.md) para instrucciones detalladas del backend.

## 🚀 Funcionalidades de Pagos Payoneer

### Para Usuarios

#### Vincular Cuenta
- Conectar cuenta de Payoneer existente
- Verificación automática de identidad
- Estado de cuenta en tiempo real

#### Enviar Pagos
1. Buscar usuario por email de Payoneer
2. Especificar cantidad y moneda
3. Agregar descripción del pago
4. Confirmación instantánea

#### Solicitar Pagos
1. Enviar solicitud a otro usuario
2. Establecer fecha límite (opcional)
3. Seguimiento de estado de solicitud
4. Notificaciones por email

#### Gestión
- **Dashboard** con balance actual
- **Historial completo** de transacciones
- **Solicitudes pendientes** con acciones
- **Filtros avanzados** por tipo y fecha

### Beneficios
- ✅ **Transferencias gratuitas** entre usuarios Payoneer
- ✅ **Procesamiento rápido** (~2 horas típicamente)
- ✅ **Múltiples monedas** soportadas
- ✅ **Interfaz intuitiva** y moderna
- ✅ **Seguridad empresarial** de Payoneer

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── payoneer/           # Componentes de pagos Payoneer
│   │   ├── PayoneerDashboard.tsx
│   │   ├── SendPaymentModal.tsx
│   │   ├── RequestPaymentModal.tsx
│   │   ├── PaymentHistoryModal.tsx
│   │   └── LinkAccountModal.tsx
│   ├── cardsong/
│   ├── title/
│   └── ...
├── hooks/
│   ├── usePayoneer.ts      # Hook para operaciones Payoneer
│   ├── useSongs.ts
│   └── ...
├── models/
│   └── user.ts             # Modelos con tipos Payoneer
├── pages/
│   └── panel/
│       ├── payments/       # Página principal de pagos
│       ├── home/
│       └── ...
├── services/
│   ├── payoneer.ts         # Servicio API Payoneer
│   ├── auth.ts
│   └── ...
└── ...
```

## 🔨 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linting
npm run lint
```

## 🔒 Seguridad

- **Autenticación JWT** para todas las operaciones
- **Validación de entrada** en formularios
- **Verificación de firmas** en webhooks
- **Encriptación HTTPS** en todas las comunicaciones
- **Cumplimiento PCI DSS** a través de Payoneer

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Móviles** (320px+)
- 📱 **Tablets** (768px+)  
- 💻 **Desktop** (1024px+)
- 🖥️ **Pantallas grandes** (1440px+)

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

- 📧 **Email**: soporte@splitme.com
- 💬 **Discord**: [Servidor de la comunidad](https://discord.gg/splitme)
- 📚 **Documentación**: [docs.splitme.com](https://docs.splitme.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/tu-usuario/splitme/issues)

## 🔮 Próximas Funcionalidades

- [ ] Integración con más pasarelas de pago
- [ ] Pagos recurrentes automáticos
- [ ] Dashboard de analytics avanzado
- [ ] API pública para desarrolladores
- [ ] Aplicación móvil nativa

---

**Desarrollado con ❤️ por el equipo de SplitMe**
