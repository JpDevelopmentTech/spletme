Necesito implementar un sistema completo de gestión de splits (distribución de regalías) en mi backend. El sistema debe manejar condiciones avanzadas y complejas para la distribución de porcentajes entre colaboradores.

## ESTRUCTURA DE DATOS

### Modelos principales:

1. **Song** (Canción)
   - id: string
   - title: string
   - artist: string
   - ownerId: string (ID del dueño principal)
   - createdAt: Date
   - updatedAt: Date

2. **Split** (División de regalías)
   - id: string
   - songId: string
   - ownerId: string
   - ownerPercentage: number
   - totalPercentage: number (debe ser siempre 100)
   - status: 'draft' | 'active' | 'expired'
   - createdAt: Date
   - updatedAt: Date

3. **SplitParticipant** (Participantes del split)
   - id: string
   - splitId: string
   - userId: string
   - name: string
   - role: string
   - percentage: number
   - createdAt: Date
   - updatedAt: Date

4. **SplitCondition** (Condiciones de los splits)
   - id: string
   - participantId: string
   - type: 'time' | 'platforms' | 'countries' | 'time_reduced' | 'custom'
   - percentage: number
   - description: string
   - parameters: JSON
   - isActive: boolean
   - createdAt: Date
   - updatedAt: Date

### Estructura del campo parameters según el tipo:

```json
{
  "time": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31"
  },
  "platforms": {
    "platforms": ["Spotify", "Apple Music", "YouTube Music"]
  },
  "countries": {
    "countries": ["Colombia", "Brasil", "México"]
  },
  "time_reduced": {
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "finalPercentage": 5
  },
  "custom": {
    "text": "20% de Spotify solo en Colombia y Brasil durante los primeros 6 meses"
  }
}
```

## ENDPOINTS REQUERIDOS

### 1. Crear/Actualizar Split
```
POST/PUT /api/splits
Body: {
  "songId": "string",
  "owner": {
    "name": "string",
    "role": "string", 
    "percentage": number
  },
  "splits": [
    {
      "name": "string",
      "role": "string",
      "percentage": number,
      "conditions": [
        {
          "type": "time|platforms|countries|time_reduced|custom",
          "percentage": number,
          "description": "string",
          "parameters": {}
        }
      ]
    }
  ]
}
```

### 2. Obtener Split por canción
```
GET /api/splits/song/:songId
Response: Split completo con participantes y condiciones
```

### 3. Calcular distribución actual
```
GET /api/splits/:splitId/calculate?date=YYYY-MM-DD&platform=spotify&country=colombia
Response: {
  "owner": { "name": "string", "percentage": number, "amount": number },
  "participants": [
    { "name": "string", "percentage": number, "amount": number, "appliedConditions": [] }
  ],
  "totalAmount": number,
  "calculationDate": "date",
  "filters": { "platform": "string", "country": "string" }
}
```

### 4. Historial de pagos
```
GET /api/splits/:splitId/payments
POST /api/splits/:splitId/payments (registrar pago)
```

## LÓGICA DE NEGOCIO REQUERIDA

### 1. Validaciones:
- La suma de porcentajes (owner + participantes) debe ser exactamente 100%
- Las fechas en condiciones de tiempo deben ser válidas
- Los porcentajes de condiciones no pueden exceder el porcentaje base del participante
- No permitir splits duplicados para la misma canción activa

### 2. Cálculo de distribución:
- Evaluar condiciones por fecha actual
- Filtrar por plataforma si se especifica
- Filtrar por país si se especifica
- Aplicar condiciones de tiempo (verificar si está en el rango)
- Aplicar reducciones de porcentaje por tiempo
- Manejar condiciones personalizadas

### 3. Algoritmo de cálculo:
```
Para cada participante:
1. Comenzar con porcentaje base
2. Evaluar cada condición activa:
   - Si es condición de tiempo: verificar fechas
   - Si es condición de plataforma: verificar si coincide
   - Si es condición de país: verificar si coincide
   - Si es tiempo reducido: aplicar porcentaje según fecha
3. Aplicar el porcentaje resultante al monto total
4. Registrar qué condiciones se aplicaron
```

## CASOS DE USO ESPECÍFICOS

### Ejemplo 1: Condición de tiempo
```
Participante tiene 20% base
Condición: 15% desde 2024-01-01 hasta 2024-06-30
Si fecha actual está en rango: usar 15%
Si fecha actual fuera de rango: usar 20% base
```

### Ejemplo 2: Condición de plataforma
```
Participante tiene 20% base
Condición: 10% solo en Spotify
Si consulta es para Spotify: usar 10%
Si consulta es para otra plataforma: usar 20% base
```

### Ejemplo 3: Condición reducida
```
Participante tiene 20% base
Condición: 25% del 2024-01-01 al 2024-12-31, luego 5%
Si fecha está en rango: usar 25%
Si fecha después del rango: usar 5%
Si fecha antes del rango: usar 20% base
```

## CONSIDERACIONES TÉCNICAS

1. **Base de datos**: Usar transacciones para mantener consistencia
2. **Cache**: Cachear cálculos frecuentes de distribución
3. **Auditoría**: Registrar todos los cambios en splits
4. **Notificaciones**: Notificar a participantes cuando se crean/modifican splits
5. **Reportes**: Generar reportes de earnings por período
6. **API Rate Limiting**: Para endpoints de cálculo intensivo

## ENDPOINTS ADICIONALES ÚTILES

```
GET /api/splits/user/:userId (splits donde participa el usuario)
GET /api/splits/:splitId/preview (preview de cálculo sin guardar)
POST /api/splits/:splitId/duplicate (duplicar split para nueva canción)
DELETE /api/splits/:splitId (soft delete)
GET /api/analytics/splits (estadísticas generales)
```

## RESPUESTAS DE ERROR ESPERADAS

- 400: Porcentajes no suman 100%
- 404: Split/Canción no encontrada
- 409: Split ya existe para esta canción
- 422: Condiciones inválidas o conflictivas

Implementa este sistema con validaciones robustas, manejo de errores apropiado y documentación completa de la API. 