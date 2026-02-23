# PROMPT PARA ANTIGRAVITY - SISTEMA TETRAEDRO v3.0

## CONTEXTO DEL PROYECTO

Crea un sistema completo de gestión y auditoría de procesos para PyMEs llamado TETRAEDRO v3.0. Es una plataforma web integral que centraliza la gestión de cuatro especialidades: Project Management, Contaduría, Calidad y Tecnología Informática.

## ARQUITECTURA TÉCNICA REQUERIDA

### Stack Tecnológico
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Supabase self-hosted (PostgreSQL 15 + PostgREST + GoTrue + Realtime + Storage)
- **Orquestación**: Docker + Docker Compose
- **Base de datos**: PostgreSQL 15+ con extensiones (uuid-ossp, pg_cron)
- **Caché**: Redis 7
- **API Gateway**: Kong
- **Monitoring**: Prometheus + Grafana

### Estructura de Despliegue
Genera un proyecto con:
1. **docker-compose.yml** completo que incluya todos los servicios
2. **Aplicación React** completa con estructura modular
3. **Configuración de Supabase** con esquemas de base de datos
4. **Scripts de inicialización** y migraciones

## SERVICIOS DOCKER COMPOSE REQUERIDOS

```yaml
# Servicios a incluir en docker-compose.yml:

1. postgres (supabase/postgres:15)
   - Variables: POSTGRES_PASSWORD, POSTGRES_DB
   - Volumen: postgres_data
   - Límites: 4 CPU, 8GB RAM

2. postgrest (postgrest/postgrest:latest)
   - Conectado a postgres
   - JWT authentication

3. gotrue (supabase/gotrue:latest)
   - Sistema de autenticación
   - OAuth, MFA, magic links

4. realtime (supabase/realtime:latest)
   - WebSocket para actualizaciones en vivo

5. storage-api (supabase/storage-api:latest)
   - Almacenamiento de archivos
   - Volumen: storage_data

6. kong (kong:latest)
   - API Gateway
   - Rate limiting

7. frontend (nginx:alpine)
   - Sirve la app React compilada
   - SSL/TLS configurado

8. redis (redis:7-alpine)
   - Caché de sesiones
   - Volumen: redis_data

9. prometheus + grafana
   - Monitoring stack
   - Dashboards predefinidos

10. backup-service (custom)
    - Backups automáticos de PostgreSQL
    - Cron jobs configurados
```

## ESQUEMA DE BASE DE DATOS POSTGRESQL

Crea las siguientes tablas principales con sus relaciones:

### Usuarios y Autenticación
```sql
-- Roles y permisos
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  permissions JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Usuarios (extiende auth.users de Supabase)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  role_id UUID REFERENCES roles(id),
  department VARCHAR(100),
  position VARCHAR(100),
  avatar_url TEXT,
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de Procesos
```sql
-- Procesos empresariales
CREATE TABLE processes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- operativo, estratégico, soporte
  owner_id UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'active',
  flow_diagram_url TEXT,
  documentation_url TEXT,
  version INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Pasos de proceso
CREATE TABLE process_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  process_id UUID REFERENCES processes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  responsible_role_id UUID REFERENCES roles(id),
  estimated_duration_minutes INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de Project Management
```sql
-- Proyectos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client VARCHAR(255),
  manager_id UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'planning', -- planning, active, on-hold, completed, cancelled
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  actual_end_date DATE,
  budget DECIMAL(15,2),
  actual_cost DECIMAL(15,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tareas
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, in-progress, completed, blocked
  priority VARCHAR(20) DEFAULT 'medium',
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  estimated_hours DECIMAL(6,2),
  actual_hours DECIMAL(6,2),
  progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  dependencies JSONB, -- array de task_ids
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seguimiento de tiempo
CREATE TABLE time_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES user_profiles(id),
  date DATE NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de Auditorías
```sql
-- Auditorías
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL, -- interna, externa, ISO, financiera, proceso
  scope TEXT,
  auditor_id UUID REFERENCES user_profiles(id),
  audited_area VARCHAR(100),
  status VARCHAR(20) DEFAULT 'planned', -- planned, in-progress, completed
  planned_date DATE,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hallazgos de auditoría
CREATE TABLE audit_findings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  finding_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20), -- critico, mayor, menor, observacion
  process_id UUID REFERENCES processes(id),
  responsible_id UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'open', -- open, in-progress, closed, verified
  evidence_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de Calidad (SGI)
```sql
-- No conformidades
CREATE TABLE non_conformities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50), -- producto, proceso, sistema
  source VARCHAR(50), -- auditoria, cliente, interna
  process_id UUID REFERENCES processes(id),
  detected_by UUID REFERENCES user_profiles(id),
  responsible_id UUID REFERENCES user_profiles(id),
  status VARCHAR(20) DEFAULT 'open',
  severity VARCHAR(20),
  detection_date DATE,
  closure_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Acciones correctivas/preventivas
CREATE TABLE corrective_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  non_conformity_id UUID REFERENCES non_conformities(id),
  type VARCHAR(20), -- correctiva, preventiva
  description TEXT,
  responsible_id UUID REFERENCES user_profiles(id),
  due_date DATE,
  completion_date DATE,
  status VARCHAR(20) DEFAULT 'pending',
  effectiveness_verified BOOLEAN DEFAULT false,
  verification_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Riesgos
CREATE TABLE risks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- operacional, financiero, estrategico, cumplimiento
  process_id UUID REFERENCES processes(id),
  owner_id UUID REFERENCES user_profiles(id),
  probability INT CHECK (probability >= 1 AND probability <= 5),
  impact INT CHECK (impact >= 1 AND impact <= 5),
  risk_level INT GENERATED ALWAYS AS (probability * impact) STORED,
  mitigation_plan TEXT,
  status VARCHAR(20) DEFAULT 'identified',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de KPIs y BSC
```sql
-- Indicadores (KPIs)
CREATE TABLE indicators (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- financiero, cliente, proceso, aprendizaje (BSC)
  unit VARCHAR(50), -- %, USD, días, etc.
  calculation_formula TEXT,
  target_value DECIMAL(15,2),
  warning_threshold DECIMAL(15,2),
  critical_threshold DECIMAL(15,2),
  frequency VARCHAR(20), -- diario, semanal, mensual, trimestral, anual
  responsible_id UUID REFERENCES user_profiles(id),
  process_id UUID REFERENCES processes(id),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Mediciones de indicadores
CREATE TABLE indicator_measurements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  indicator_id UUID REFERENCES indicators(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  actual_value DECIMAL(15,2) NOT NULL,
  target_value DECIMAL(15,2),
  status VARCHAR(20), -- on-target, warning, critical
  comments TEXT,
  measured_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Módulo de Documentos
```sql
-- Documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- procedimiento, instructivo, formato, registro, politica
  category VARCHAR(100),
  process_id UUID REFERENCES processes(id),
  version VARCHAR(20),
  status VARCHAR(20) DEFAULT 'draft', -- draft, review, approved, obsolete
  owner_id UUID REFERENCES user_profiles(id),
  file_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  approval_date DATE,
  review_date DATE,
  next_review_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Historial de versiones de documentos
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version VARCHAR(20) NOT NULL,
  file_url TEXT NOT NULL,
  changes_description TEXT,
  created_by UUID REFERENCES user_profiles(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Auditoría del Sistema (Audit Log)
```sql
-- Log de auditoría completo
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name VARCHAR(100) NOT NULL,
  record_id UUID NOT NULL,
  action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  user_id UUID REFERENCES user_profiles(id),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Crear índices para búsquedas eficientes
CREATE INDEX idx_audit_log_table ON audit_log(table_name);
CREATE INDEX idx_audit_log_record ON audit_log(record_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);
```

## ROW LEVEL SECURITY (RLS)

Implementa políticas RLS para todas las tablas. Ejemplo:

```sql
-- Habilitar RLS en todas las tablas
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
-- ... etc para todas las tablas

-- Política de ejemplo: usuarios pueden ver procesos de su departamento
CREATE POLICY "Users can view processes from their department"
  ON processes FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name IN ('admin', 'quality_manager'))
    )
  );
```

## APLICACIÓN FRONTEND REACT

### Estructura de Carpetas
```
src/
├── components/
│   ├── common/           # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Form/
│   │   └── Charts/
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   └── modules/          # Componentes por módulo
│       ├── processes/
│       ├── projects/
│       ├── audits/
│       ├── quality/
│       ├── kpis/
│       └── documents/
├── pages/
│   ├── Dashboard.tsx
│   ├── processes/
│   ├── projects/
│   ├── audits/
│   ├── quality/
│   ├── kpis/
│   ├── documents/
│   └── settings/
├── hooks/                # Custom React hooks
│   ├── useAuth.ts
│   ├── useSupabase.ts
│   ├── useRealtime.ts
│   └── usePermissions.ts
├── services/             # API services
│   ├── supabase.ts
│   ├── processes.service.ts
│   ├── projects.service.ts
│   ├── audits.service.ts
│   └── auth.service.ts
├── store/                # State management (Zustand o Context)
│   ├── authStore.ts
│   ├── processStore.ts
│   └── projectStore.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── constants.ts
├── types/
│   ├── database.types.ts # Tipos generados desde Supabase
│   ├── process.types.ts
│   └── project.types.ts
└── App.tsx
```

### Componentes Principales a Crear

#### 1. Dashboard Ejecutivo
```tsx
// Dashboard con widgets configurables que muestre:
- Estado de proyectos (on-time, en riesgo, retrasados)
- KPIs principales en tiempo real
- No conformidades abiertas
- Próximas auditorías
- Alertas de procesos críticos
- Gráficos interactivos (Recharts o Chart.js)
```

#### 2. Módulo de Procesos
```tsx
// Componentes necesarios:
- ListaProcesos.tsx (tabla con filtros y búsqueda)
- DetalleProceso.tsx (vista detallada con diagrama de flujo)
- FormularioProceso.tsx (crear/editar proceso)
- MapaProcesos.tsx (visualización tipo mapa de procesos)
- HistorialVersiones.tsx
```

#### 3. Módulo de Project Management
```tsx
// Componentes necesarios:
- ListaProyectos.tsx (vista tipo Kanban y lista)
- DetalleProyecto.tsx (dashboard del proyecto)
- GanttChart.tsx (cronograma interactivo)
- TareasTablero.tsx (tablero Kanban de tareas)
- RecursosAsignados.tsx
- SeguimientoTiempo.tsx (timesheet)
```

#### 4. Módulo de Auditorías
```tsx
// Componentes necesarios:
- CalendarioAuditorias.tsx
- PlanAuditoria.tsx
- Hallazgos.tsx (lista y gestión de hallazgos)
- InformeAuditoria.tsx (generación de reportes)
```

#### 5. Módulo de Calidad
```tsx
// Componentes necesarios:
- NoConformidades.tsx
- AccionesCorrectivas.tsx
- MatrizRiesgos.tsx (visualización 5x5)
- IndicadoresCalidad.tsx
```

#### 6. Módulo de KPIs / BSC
```tsx
// Componentes necesarios:
- BSCDashboard.tsx (4 perspectivas)
- GestionIndicadores.tsx
- RegistroMediciones.tsx
- GraficosEvolucion.tsx
- ReportesKPI.tsx
```

### Autenticación y Permisos
```tsx
// Implementar:
- Login/Logout con Supabase Auth
- Recuperación de contraseña
- Registro de usuarios (solo admin)
- Verificación de permisos por rol
- Guards de rutas protegidas
- Componente ProtectedRoute
```

### Features de UI/UX
```tsx
// Implementar:
- Tema claro/oscuro
- Responsive design (móvil, tablet, desktop)
- Notificaciones toast (react-hot-toast)
- Confirmaciones de acciones destructivas
- Loading states y skeletons
- Error boundaries
- Búsqueda global
- Exportación a PDF/Excel
```

## FUNCIONALIDADES CLAVE A IMPLEMENTAR

### 1. Realtime Subscriptions
```typescript
// Actualización en vivo de:
- Estado de proyectos
- Nuevas tareas asignadas
- Alertas de KPIs fuera de rango
- Nuevos hallazgos de auditoría
- Cambios en procesos
```

### 2. Sistema de Notificaciones
```typescript
// Notificar cuando:
- Se asigna una tarea
- Vence una fecha límite
- Se crea un hallazgo relacionado
- KPI sale de rango
- Documento requiere revisión
- Se completa una acción correctiva
```

### 3. Generación de Reportes
```typescript
// Reportes automáticos en PDF:
- Reporte de estado de proyectos
- Informe de auditoría
- Reporte de KPIs por período
- Análisis de riesgos
- Cumplimiento de acciones correctivas
```

### 4. Gestión de Archivos
```typescript
// Usar Supabase Storage para:
- Diagramas de flujo de procesos
- Documentos ISO
- Evidencias de auditoría
- Archivos adjuntos en tareas
- Versionado automático
```

### 5. Búsqueda Global
```typescript
// Implementar búsqueda full-text en:
- Procesos
- Proyectos
- Documentos
- Hallazgos
- KPIs
```

## ARCHIVOS DE CONFIGURACIÓN REQUERIDOS

### 1. docker-compose.yml
Genera el archivo completo con todos los servicios, redes, volúmenes y configuraciones.

### 2. .env.example
```env
# PostgreSQL
POSTGRES_PASSWORD=your-super-secret-password
POSTGRES_DB=tetraedro

# Supabase
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters
ANON_KEY=your-anon-key
SERVICE_ROLE_KEY=your-service-role-key

# API URLs
API_URL=http://localhost:3000
POSTGRES_URL=postgres://postgres:${POSTGRES_PASSWORD}@postgres:5432/tetraedro

# Kong
KONG_HTTP_PORT=8000
KONG_HTTPS_PORT=8443

# Storage
STORAGE_BACKEND=file
FILE_SIZE_LIMIT=52428800

# SMTP (para emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
```

### 3. Dockerfile para frontend
```dockerfile
# Multi-stage build para React
FROM node:20-alpine AS builder
# ... configuración de build

FROM nginx:alpine
# ... configuración de nginx
```

### 4. nginx.conf
```nginx
# Configuración de nginx para:
- Reverse proxy a APIs
- Compresión gzip
- SSL/TLS
- Cache headers
- SPA routing
```

### 5. Scripts de inicialización
```bash
# scripts/init-db.sh
# scripts/backup.sh
# scripts/restore.sh
# scripts/migrate.sh
```

## INSTRUCCIONES ESPECIALES

1. **Genera código TypeScript** estricto con tipos completos
2. **Usa Tailwind CSS** para todos los estilos (no CSS modules)
3. **Implementa componentes reutilizables** siguiendo atomic design
4. **Agrega comentarios** en español en partes clave del código
5. **Incluye validaciones** de formularios con react-hook-form + zod
6. **Manejo de errores** robusto en todas las operaciones async
7. **Optimiza consultas** a Supabase con select específicos
8. **Implementa paginación** en todas las listas
9. **Agrega tests unitarios** básicos para funciones críticas
10. **Documenta APIs** con comentarios JSDoc

## PRIORIDAD DE DESARROLLO

**Fase 1 - Core (crear primero):**
- Docker compose completo funcional
- Esquemas de base de datos con RLS
- Sistema de autenticación
- Layout y navegación
- Dashboard básico

**Fase 2 - Módulos principales:**
- Módulo de Procesos completo
- Módulo de Project Management básico
- Sistema de permisos funcional

**Fase 3 - Módulos avanzados:**
- Auditorías
- Calidad (SGI)
- KPIs / BSC
- Documentos

**Fase 4 - Features avanzados:**
- Realtime subscriptions
- Notificaciones
- Reportes PDF
- Búsqueda global
- Exportaciones

## RESULTADO ESPERADO

Un proyecto completamente funcional que incluya:
- ✅ docker-compose.yml listo para `docker-compose up -d`
- ✅ Aplicación React completa y ejecutable
- ✅ Base de datos PostgreSQL con esquemas y datos de prueba
- ✅ Autenticación funcionando
- ✅ Al menos 3 módulos principales operativos
- ✅ Dashboard ejecutivo con datos en vivo
- ✅ README.md con instrucciones de instalación y uso
- ✅ Scripts de inicialización y respaldo

## NOTAS FINALES

- Prioriza **funcionalidad sobre perfección** estética en primera iteración
- Usa **librerías estables y bien mantenidas**
- Implementa **best practices** de React y TypeScript
- El código debe ser **production-ready** desde el inicio
- Sigue **principios SOLID** en la arquitectura
- Implementa **logging** apropiado para debugging
- Considera **performance** desde el diseño inicial

---

**IMPORTANTE**: Este es un sistema empresarial crítico. El código debe ser robusto, seguro y escalable. Prioriza la calidad sobre la velocidad de desarrollo.
