# 🤖 ChatBot IA Frontend

Frontend completo para el sistema de chatbot con inteligencia artificial integrado con WhatsApp Business, desarrollado con Next.js y conectado al backend a través de proxy.

## 📋 Características

- **Arquitectura Frontend-Only**: Aplicación Next.js que se comunica con el backend externo
- **Proxy de API**: Configuración de Next.js para redirigir llamadas API al backend
- **Sistema de Diseño**: Componentes UI consistentes basados en Tailwind CSS
- **Autenticación JWT**: Manejo de tokens para autenticación segura
- **Modo Oscuro**: Soporte completo para tema oscuro
- **Responsive Design**: Adaptable a todos los dispositivos
- **TypeScript**: Tipado estático para mayor robustez

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd chatbot-ia

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local
# Editar .env.local con tus configuraciones

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
npm start
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```env
# URL del backend
BACKEND_URL=http://localhost:8080

# Configuración de la aplicación
NEXT_PUBLIC_APP_NAME=ChatBot IA
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION=Chatbot con IA para WhatsApp Business

# Token de desarrollo (opcional)
NEXT_PUBLIC_DEFAULT_TOKEN=your-dev-token-here
```

### Proxy de API

El frontend está configurado para redirigir automáticamente las llamadas API al backend:

- `/api/*` → `BACKEND_URL/api/*`
- `/webhooks/*` → `BACKEND_URL/webhooks/*`

## 📱 Pantallas Disponibles

### 🏠 Dashboard Principal (`/`)
- Panel de control central con acceso a todas las funcionalidades
- Estadísticas del sistema en tiempo real
- Actividad reciente del sistema
- Enlaces rápidos a todas las pantallas

### 📨 Bandeja de Entrada (`/messages`)
- Gestión de conversaciones de WhatsApp
- Vista de lista de conversaciones con filtros
- Chat en tiempo real con clientes
- Estados de conversación (abierta/cerrada)
- Envío de mensajes y cierre de conversaciones

### 👥 Gestión de Clientes (`/clients`)
- CRUD completo de clientes del sistema
- Estadísticas de clientes activos/inactivos
- Vista detallada de cada cliente
- Enlaces a números WhatsApp y Knowledge Bases

### 📱 Números WhatsApp (`/client-phones`)
- Registro de números de WhatsApp Business
- Asociación con clientes específicos
- Configuración de proveedores (Meta, Twilio)
- Estados de números (activo/inactivo, por defecto)

### 🧠 Knowledge Base (`/knowledge-base`)
- Gestión de bases de conocimiento
- Creación y configuración de KB por cliente
- Búsqueda semántica en documentos
- Vista detallada de cada Knowledge Base

### 📤 Ingesta de Documentos (`/documents/ingest`)
- Carga masiva de documentos a Knowledge Bases
- Formulario para agregar contenido
- Procesamiento de documentos con metadatos
- Resultados de ingesta en tiempo real

### 💬 Chat con IA (`/chat`)
- Interfaz de chat directa con el sistema RAG
- Streaming de respuestas en tiempo real
- Filtros por cliente para búsquedas específicas
- Historial de conversaciones

### 📊 Métricas del Sistema (`/metrics`)
- Monitoreo del estado del sistema
- Health checks básicos y detallados
- Información de servicios externos
- Métricas de rendimiento

### 👤 Gestión de Usuarios (`/users`)
- Administración de usuarios del sistema
- Creación y gestión de usuarios
- Estados de consentimiento
- Vista de usuarios registrados

### 🔐 Login (`/login`)
- Autenticación de usuarios
- Manejo de tokens JWT
- Redirección automática al dashboard
- Modo desarrollo con credenciales flexibles

## 🎨 Sistema de Diseño

### Componentes UI Disponibles

- **Button**: Botones con variantes (primary, secondary, outline, ghost, danger)
- **Input**: Campos de entrada con validación
- **Card**: Tarjetas con variantes (default, elevated, outlined)
- **Badge**: Etiquetas con estados semánticos
- **Avatar**: Avatares con diferentes tamaños
- **Spinner**: Indicadores de carga
- **Alert**: Alertas con variantes

### Colores del Sistema

- **Primary**: `#1173d4` (azul corporativo)
- **Success**: Verde para estados exitosos
- **Warning**: Naranja para advertencias
- **Error**: Rojo para errores
- **Info**: Azul para información

### Tipografía

- **Fuente Principal**: Inter (Google Fonts)
- **Pesos**: 400, 500, 600, 700
- **Jerarquía**: H1-H6 con tamaños escalados

## 🔧 Hooks Personalizados

### `useAuth`
Manejo de autenticación y tokens JWT:
```typescript
const { isAuthenticated, isLoading, login, logout } = useAuth();
```

### `useClients`
Gestión de clientes:
```typescript
const { clients, isLoading, error, createClient } = useClients();
```

### `useClientPhones`
Gestión de números WhatsApp:
```typescript
const { phones, isLoading, error, createPhone, deletePhone } = useClientPhones(clientId);
```

### `useKnowledgeBase`
Gestión de Knowledge Bases:
```typescript
const { knowledgeBase, isLoading, error, createKnowledgeBase, searchKnowledgeBase, ingestDocuments } = useKnowledgeBase(kbId);
```

### `useChat`
Chat con IA:
```typescript
const { sendMessage, isLoading, error } = useChat();
```

## 📡 API Integration

### Servicios Disponibles

El frontend consume todos los endpoints definidos en `api-docs.json`:

- **Conversaciones**: GET, POST para gestión de conversaciones
- **Clientes**: CRUD completo de clientes
- **Números WhatsApp**: Registro y gestión de números
- **Knowledge Base**: Creación, búsqueda e ingesta
- **Sistema**: Health checks y información del sistema
- **Webhooks**: Endpoints para WhatsApp Business

### Manejo de Errores

- Interceptores de errores en todos los hooks
- Alertas contextuales para el usuario
- Fallbacks para servicios no disponibles
- Retry automático en fallos de red

## 🛠️ Desarrollo

### Estructura del Proyecto

```
src/
├── app/                    # Páginas de Next.js App Router
│   ├── page.tsx           # Dashboard principal
│   ├── login/             # Página de login
│   ├── messages/          # Bandeja de entrada
│   ├── clients/           # Gestión de clientes
│   ├── client-phones/     # Números WhatsApp
│   ├── knowledge-base/    # Knowledge Base
│   ├── documents/         # Ingesta de documentos
│   ├── chat/              # Chat con IA
│   ├── metrics/           # Métricas del sistema
│   ├── users/             # Gestión de usuarios
│   └── globals.css        # Estilos globales
├── components/
│   └── ui/                # Componentes del sistema de diseño
├── hooks/                 # Hooks personalizados
├── services/              # Servicios de API
├── types/                 # Tipos TypeScript
└── utils/                 # Utilidades
```

### Scripts Disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros para autenticación
- **CORS**: Configuración de headers CORS para API
- **Validación**: Validación de entrada en formularios
- **Sanitización**: Limpieza de datos de entrada

## 📱 Responsive Design

- **Mobile First**: Diseño optimizado para móviles
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Componentes Adaptativos**: Todos los componentes son responsive
- **Navegación Móvil**: Menús optimizados para touch

## 🌙 Modo Oscuro

- **Detección Automática**: Basado en preferencias del sistema
- **Toggle Manual**: Control manual del tema
- **Variables CSS**: Colores adaptativos
- **Componentes**: Todos los componentes soportan modo oscuro

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Configurar variables de entorno en Vercel Dashboard
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Variables de Entorno en Producción

Asegúrate de configurar:
- `BACKEND_URL`: URL del backend en producción
- `NEXT_PUBLIC_APP_NAME`: Nombre de la aplicación
- `NEXT_PUBLIC_APP_VERSION`: Versión de la aplicación

## 📚 Documentación Adicional

- [Sistema de Diseño](./DESIGN_SYSTEM.md): Guía completa del sistema de diseño
- [API Documentation](./api-docs.json): Especificaciones de la API
- [Diseños Originales](./stitch_bandeja_de_entrada_de_mensajes/): Archivos de diseño

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico, contacta a:
- **Email**: soporte@relative.com
- **Website**: https://relative.com

---

**Desarrollado con ❤️ por el equipo de Relative**