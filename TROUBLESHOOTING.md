# TETRAEDRO v3.0 - Solución de Problemas

## ✅ Problema Resuelto: Docker Build Error

### Error Original
```
npm error Run "npm help ci" for more info
failed to solve: process "/bin/sh -c npm ci --only=production" did not complete successfully: exit code: 1
```

### Causa
El comando `npm ci` requiere que exista el archivo `package-lock.json`, pero este no se había generado aún.

### Solución Aplicada

1. **Instalé las dependencias localmente** para generar `package-lock.json`:
   ```bash
   npm install
   ```

2. **Creé `.dockerignore`** para optimizar el build de Docker

3. **Actualicé `.env.example`** con las variables necesarias para Vite

4. **Creé `.env`** copiando desde `.env.example`

### Archivos Modificados/Creados

- ✅ `package-lock.json` - Generado automáticamente
- ✅ `.dockerignore` - Optimización de build
- ✅ `.env.example` - Variables actualizadas
- ✅ `.env` - Configuración local

## 🚀 Próximos Pasos

### 1. Configurar variables de entorno

Editar el archivo `.env` y cambiar los siguientes valores:

```env
# Cambiar esta contraseña
POSTGRES_PASSWORD=tu-password-seguro-aqui

# Generar un JWT secret con: openssl rand -base64 32
JWT_SECRET=tu-jwt-secret-de-minimo-32-caracteres-aqui

# Configurar SMTP si quieres emails (opcional por ahora)
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password-de-aplicacion
```

### 2. Levantar servicios con Docker

```bash
docker-compose up -d
```

### 3. Verificar que todo funcione

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f

# Verificar PostgreSQL
docker-compose exec postgres psql -U postgres -d tetraedro -c "SELECT version();"
```

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API Gateway (Kong)**: http://localhost:8000
- **Grafana**: http://localhost:3002 (admin/admin)
- **Prometheus**: http://localhost:9090

### 5. Desarrollo local (sin Docker)

Si prefieres ejecutar solo el frontend localmente:

```bash
# Asegurarse de que los servicios backend estén corriendo
docker-compose up -d postgres postgrest gotrueauth realtime storage kong redis

# Ejecutar frontend en modo desarrollo
npm run dev
```

El frontend estará en http://localhost:5173

## 📝 Notas Importantes

### Seguridad
- ⚠️ **NUNCA** commitear el archivo `.env` al repositorio
- ⚠️ Cambiar las contraseñas por defecto antes de producción
- ⚠️ Generar JWT secrets únicos y seguros

### Puertos Utilizados
- `3000` - Frontend (Nginx en Docker)
- `5173` - Frontend (Vite dev server)
- `5432` - PostgreSQL
- `3001` - PostgREST
- `8000` - Kong API Gateway
- `9999` - GoTrue
- `4000` - Realtime
- `5000` - Storage API
- `6379` - Redis
- `9090` - Prometheus
- `3002` - Grafana

### Comandos Útiles

```bash
# Detener servicios
docker-compose down

# Reconstruir servicios
docker-compose up -d --build

# Ver logs de un servicio específico
docker-compose logs -f postgres

# Limpiar todo (¡CUIDADO! Borra datos)
docker-compose down -v
```

## 🐛 Otros Problemas Comunes

### Puerto ya en uso

**Síntoma**: Error "port is already allocated"

**Solución**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### PostgreSQL no inicia

**Síntoma**: Container se reinicia constantemente

**Solución**:
```bash
# Ver logs detallados
docker-compose logs postgres

# Verificar permisos de volúmenes
docker volume ls
docker volume inspect iapymes_postgres_data
```

### Frontend no compila

**Síntoma**: Errores de TypeScript o imports

**Solución**:
```bash
# Limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar tipos
npm run type-check
```

## ✅ Estado Actual del Proyecto

- ✅ Infraestructura Docker configurada (10 servicios)
- ✅ Base de datos PostgreSQL con esquema completo
- ✅ Frontend React + TypeScript + Tailwind
- ✅ Autenticación con Supabase
- ✅ Layout responsive con Header/Sidebar
- ✅ Dashboard ejecutivo con gráficos
- ✅ Dependencies instaladas (377 packages)
- ✅ package-lock.json generado
- ✅ .env configurado

**Progreso: 40% (6/15 fases completadas)**

## 📚 Documentación

- [README.md](file:///c:/Users/Matias/Documents/Proyectos/iapymes/README.md) - Documentación completa
- [QUICKSTART.md](file:///c:/Users/Matias/Documents/Proyectos/iapymes/QUICKSTART.md) - Guía de inicio rápido
- [walkthrough.md](file:///C:/Users/Matias/.gemini/antigravity/brain/23b8c678-fabf-4fcc-9b04-d1f22633d793/walkthrough.md) - Walkthrough detallado
