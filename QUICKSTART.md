# Guía de Inicio Rápido - TETRAEDRO v3.0

## 🚀 Inicio Rápido (5 minutos)

### 1. Configurar variables de entorno

```bash
cd c:\Users\Matias\Documents\Proyectos\iapymes
copy .env.example .env
```

Editar `.env` y cambiar al menos:
```env
POSTGRES_PASSWORD=tu-password-seguro
JWT_SECRET=tu-jwt-secret-de-32-caracteres-minimo
```

### 2. Instalar dependencias del frontend

```bash
npm install
```

### 3. Levantar servicios con Docker

```bash
docker-compose up -d
```

### 4. Verificar que todo esté funcionando

```bash
# Ver estado de servicios
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 5. Acceder a la aplicación

- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **Grafana**: http://localhost:3002 (admin/admin)

## 📝 Crear primer usuario

1. Ir a http://localhost:3000
2. Hacer clic en "Registrarse" (si está habilitado) o:
3. Conectar a PostgreSQL y crear usuario manualmente:

```bash
docker-compose exec postgres psql -U postgres -d tetraedro
```

```sql
-- Ver usuarios existentes
SELECT * FROM auth.users;

-- Asignar rol de admin a un usuario
UPDATE user_profiles 
SET role_id = '11111111-1111-1111-1111-111111111111' 
WHERE id = 'tu-user-id-aqui';
```

## 🛠️ Comandos Útiles

### Docker

```bash
# Detener servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Borra datos)
docker-compose down -v

# Reconstruir servicios
docker-compose up -d --build

# Ver logs de un servicio específico
docker-compose logs -f postgres
docker-compose logs -f frontend
```

### Frontend

```bash
# Desarrollo local (sin Docker)
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Verificar tipos
npm run type-check

# Linting
npm run lint
```

### Base de Datos

```bash
# Conectar a PostgreSQL
docker-compose exec postgres psql -U postgres -d tetraedro

# Backup manual
docker-compose exec backup /backup.sh

# Restaurar backup
docker-compose exec backup /restore.sh /backups/archivo.sql.gz
```

## 🐛 Solución de Problemas

### Puerto 3000 ya en uso

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# O cambiar puerto en vite.config.ts
```

### PostgreSQL no inicia

```bash
# Ver logs
docker-compose logs postgres

# Reiniciar servicio
docker-compose restart postgres
```

### Frontend no compila

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

## 📚 Próximos Pasos

1. ✅ Completar registro de usuario admin
2. ✅ Explorar el Dashboard
3. ⏳ Configurar SMTP para emails
4. ⏳ Personalizar roles y permisos
5. ⏳ Importar datos iniciales

## 🔗 Enlaces Útiles

- [Documentación completa](./README.md)
- [Supabase Docs](https://supabase.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
