# TETRAEDRO v3.0

Sistema completo de gestión y auditoría de procesos para PyMEs que centraliza la gestión de cuatro especialidades: Project Management, Contaduría, Calidad y Tecnología Informática.

## 🚀 Características Principales

- ✅ **Gestión de Procesos**: Mapeo, documentación y control de procesos empresariales
- ✅ **Project Management**: Gestión completa de proyectos con Gantt, Kanban y seguimiento de tiempo
- ✅ **Auditorías**: Planificación, ejecución y seguimiento de auditorías internas y externas
- ✅ **Sistema de Calidad (SGI)**: No conformidades, acciones correctivas y gestión de riesgos
- ✅ **KPIs / BSC**: Balanced Scorecard con 4 perspectivas e indicadores en tiempo real
- ✅ **Gestión Documental**: Control de versiones y workflow de aprobación
- ✅ **Realtime**: Actualizaciones en vivo con WebSocket
- ✅ **Reportes PDF**: Generación automática de informes
- ✅ **Búsqueda Global**: Full-text search en toda la plataforma

## 🛠️ Stack Tecnológico

### Backend
- **Supabase Self-Hosted**: PostgreSQL 15 + PostgREST + GoTrue + Realtime + Storage
- **Kong**: API Gateway con rate limiting y CORS
- **Redis**: Caché de sesiones
- **Prometheus + Grafana**: Monitoring y métricas

### Frontend
- **React 18** + **TypeScript**
- **Vite**: Build tool ultra-rápido
- **Tailwind CSS**: Utility-first CSS
- **Zustand**: State management ligero
- **Recharts**: Gráficos interactivos
- **React Hook Form + Zod**: Validación de formularios
- **React PDF**: Generación de reportes

### DevOps
- **Docker + Docker Compose**: Orquestación de servicios
- **Nginx**: Servidor web y reverse proxy
- **Backups automáticos**: PostgreSQL dumps programados

## 📋 Requisitos Previos

- **Docker** 24.0+ y **Docker Compose** 2.20+
- **Node.js** 20+ y **npm** (solo para desarrollo local)
- **8GB RAM** mínimo (16GB recomendado para producción)
- **4 CPU cores** mínimo

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/tetraedro-v3.git
cd tetraedro-v3
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` y configurar:
- `POSTGRES_PASSWORD`: Contraseña segura para PostgreSQL
- `JWT_SECRET`: Secret para JWT (generar con `openssl rand -base64 32`)
- `SMTP_*`: Configuración de email
- `GRAFANA_ADMIN_PASSWORD`: Contraseña para Grafana

### 3. Generar keys de Supabase

```bash
# Instalar Supabase CLI (opcional)
npm install -g supabase

# O usar valores de ejemplo en .env.example
```

### 4. Levantar servicios

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f

# Verificar estado
docker-compose ps
```

### 5. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **PostgREST API**: http://localhost:3001
- **Kong API Gateway**: http://localhost:8000
- **Grafana**: http://localhost:3002 (admin/admin)
- **Prometheus**: http://localhost:9090

## 👥 Usuario Inicial

Después de la instalación, crear el primer usuario admin:

1. Registrarse en http://localhost:3000
2. Conectar a PostgreSQL:
   ```bash
   docker-compose exec postgres psql -U postgres -d tetraedro
   ```
3. Asignar rol de admin:
   ```sql
   UPDATE user_profiles 
   SET role_id = '11111111-1111-1111-1111-111111111111' 
   WHERE id = 'tu-user-id';
   ```

## 🔧 Desarrollo Local

### Instalar dependencias

```bash
npm install
```

### Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000

### Build para producción

```bash
npm run build
```

### Verificar tipos TypeScript

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
tetraedro-v3/
├── database/
│   ├── migrations/          # Migraciones SQL
│   └── seed/                # Datos iniciales
├── scripts/
│   ├── init-db.sh          # Inicialización de DB
│   ├── backup.sh           # Script de backup
│   └── restore.sh          # Script de restore
├── src/
│   ├── components/         # Componentes React
│   │   ├── common/         # Componentes reutilizables
│   │   ├── layout/         # Layout components
│   │   ├── modules/        # Componentes por módulo
│   │   └── auth/           # Autenticación
│   ├── pages/              # Páginas de la app
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── store/              # Zustand stores
│   ├── utils/              # Utilidades
│   └── types/              # TypeScript types
├── docker-compose.yml      # Orquestación de servicios
├── Dockerfile              # Build de frontend
├── nginx.conf              # Configuración Nginx
└── package.json            # Dependencias Node
```

## 🔐 Seguridad

- **Row Level Security (RLS)**: Todas las tablas tienen políticas RLS
- **JWT Authentication**: Tokens seguros con Supabase GoTrue
- **HTTPS**: Configurar SSL/TLS en producción
- **Secrets**: Nunca commitear `.env` al repositorio
- **Backups**: Automáticos cada 24 horas

## 📊 Monitoreo

### Grafana Dashboards

Acceder a http://localhost:3002 para ver:
- Métricas de PostgreSQL
- Performance de APIs
- Uso de recursos
- Logs de aplicación

### Prometheus Metrics

Métricas disponibles en http://localhost:9090

## 🔄 Backups y Restauración

### Backup manual

```bash
docker-compose exec backup /backup.sh
```

### Restaurar desde backup

```bash
docker-compose exec backup /restore.sh /backups/tetraedro_backup_YYYYMMDD_HHMMSS.sql.gz
```

## 🐛 Troubleshooting

### Los servicios no inician

```bash
# Ver logs detallados
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Reconstruir desde cero
docker-compose down -v
docker-compose up -d --build
```

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL esté healthy
docker-compose ps postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Frontend no carga

```bash
# Verificar build
docker-compose logs frontend

# Reconstruir frontend
docker-compose up -d --build frontend
```

## 📝 Licencia

Copyright © 2026 TETRAEDRO v3.0. Todos los derechos reservados.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📧 Soporte

Para soporte técnico: soporte@tetraedro.com

---

**TETRAEDRO v3.0** - Sistema de Gestión Empresarial Integral
