#!/bin/bash
# ============================================
# TETRAEDRO v3.0 - Database Initialization Script
# ============================================
# Este script se ejecuta automáticamente cuando se crea el contenedor de PostgreSQL

set -e

echo "🚀 Iniciando configuración de base de datos TETRAEDRO v3.0..."

# Esperar a que PostgreSQL esté listo
until pg_isready -U postgres; do
  echo "⏳ Esperando a que PostgreSQL esté listo..."
  sleep 2
done

echo "✅ PostgreSQL está listo"

# Crear extensiones necesarias
echo "📦 Instalando extensiones de PostgreSQL..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Extensión para UUIDs
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- Extensión para trabajos programados
    CREATE EXTENSION IF NOT EXISTS pg_cron;
    
    -- Extensión para funciones de texto
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    
    -- Extensión para búsqueda full-text
    CREATE EXTENSION IF NOT EXISTS unaccent;
EOSQL

echo "✅ Extensiones instaladas correctamente"

# Ejecutar migraciones
echo "🔄 Ejecutando migraciones..."
for migration in /docker-entrypoint-initdb.d/*.sql; do
    if [ -f "$migration" ]; then
        echo "  📄 Ejecutando: $(basename $migration)"
        psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -f "$migration"
    fi
done

echo "✅ Migraciones completadas"

# Configurar pg_cron para backups automáticos
echo "⏰ Configurando backups automáticos..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Backup diario a las 2:00 AM
    SELECT cron.schedule('daily-backup', '0 2 * * *', 'COPY (SELECT * FROM audit_log WHERE created_at < NOW() - INTERVAL ''90 days'') TO ''/backups/audit_log_archive.csv'' WITH CSV HEADER');
EOSQL

echo "✅ Backups automáticos configurados"

echo "🎉 ¡Inicialización de base de datos completada!"
