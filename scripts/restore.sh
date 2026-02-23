#!/bin/bash
# ============================================
# TETRAEDRO v3.0 - Restore Script
# ============================================
# Script para restaurar backups de la base de datos

set -e

# Verificar que se proporcionó un archivo de backup
if [ -z "$1" ]; then
    echo "❌ Error: Debe especificar el archivo de backup a restaurar"
    echo "Uso: ./restore.sh <archivo_backup.sql.gz>"
    echo ""
    echo "Backups disponibles:"
    ls -lh /backups/tetraedro_backup_*.sql.gz 2>/dev/null || echo "  No hay backups disponibles"
    exit 1
fi

BACKUP_FILE="$1"

# Verificar que el archivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Error: El archivo $BACKUP_FILE no existe"
    exit 1
fi

echo "⚠️  ADVERTENCIA: Esta operación sobrescribirá la base de datos actual"
echo "📁 Archivo de backup: $BACKUP_FILE"
echo ""
read -p "¿Está seguro de continuar? (escriba 'SI' para confirmar): " confirm

if [ "$confirm" != "SI" ]; then
    echo "❌ Operación cancelada"
    exit 0
fi

echo "🔄 Iniciando restauración de TETRAEDRO v3.0..."

# Descomprimir y restaurar
echo "💾 Restaurando base de datos..."
gunzip -c "$BACKUP_FILE" | PGPASSWORD="$POSTGRES_PASSWORD" psql \
    -h postgres \
    -U postgres \
    -d "$POSTGRES_DB" \
    --quiet

echo "✅ Base de datos restaurada exitosamente"
echo "🎉 ¡Restauración completada!"
