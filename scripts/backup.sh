#!/bin/bash
# ============================================
# TETRAEDRO v3.0 - Backup Script
# ============================================
# Script para realizar backups automáticos de la base de datos

set -e

# Configuración
BACKUP_DIR="/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/tetraedro_backup_$TIMESTAMP.sql.gz"
KEEP_DAYS=${BACKUP_KEEP_DAYS:-30}

echo "🔄 Iniciando backup de TETRAEDRO v3.0..."
echo "📅 Fecha: $(date)"

# Crear directorio de backups si no existe
mkdir -p "$BACKUP_DIR"

# Realizar backup con pg_dump
echo "💾 Creando dump de la base de datos..."
PGPASSWORD="$POSTGRES_PASSWORD" pg_dump \
    -h postgres \
    -U postgres \
    -d "$POSTGRES_DB" \
    --format=plain \
    --no-owner \
    --no-acl \
    --verbose \
    | gzip > "$BACKUP_FILE"

# Verificar que el backup se creó correctamente
if [ -f "$BACKUP_FILE" ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ Backup creado exitosamente: $BACKUP_FILE ($BACKUP_SIZE)"
else
    echo "❌ Error: No se pudo crear el backup"
    exit 1
fi

# Eliminar backups antiguos
echo "🧹 Limpiando backups antiguos (más de $KEEP_DAYS días)..."
find "$BACKUP_DIR" -name "tetraedro_backup_*.sql.gz" -type f -mtime +$KEEP_DAYS -delete

# Listar backups disponibles
echo "📋 Backups disponibles:"
ls -lh "$BACKUP_DIR"/tetraedro_backup_*.sql.gz 2>/dev/null || echo "  No hay backups disponibles"

echo "🎉 ¡Backup completado!"
