#!/bin/sh
# ─────────────────────────────────────────────────────────────────
#  HireFlow – Automated PostgreSQL Backup Script
#  Runs daily via the db-backup Docker service.
#  Keeps the last 7 daily backups automatically.
# ─────────────────────────────────────────────────────────────────

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups"
BACKUP_FILE="${BACKUP_DIR}/hireflow_${TIMESTAMP}.sql.gz"

echo "[Backup] Starting backup at ${TIMESTAMP}..."

# Dump and gzip in one command
PGPASSWORD="${POSTGRES_PASSWORD}" pg_dump \
  -h "${PGHOST:-postgres}" \
  -U "${POSTGRES_USER:-hireflow}" \
  "${POSTGRES_DB:-hireflow_db}" | gzip > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
  echo "[Backup] ✅ Backup written to ${BACKUP_FILE}"
else
  echo "[Backup] ❌ Backup FAILED at ${TIMESTAMP}" >&2
  exit 1
fi

# ─── Retention: keep last 7 backups only ──────────────────────────
ls -t "${BACKUP_DIR}"/hireflow_*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm --
echo "[Backup] 🗑  Old backups pruned. Current count: $(ls ${BACKUP_DIR}/*.sql.gz 2>/dev/null | wc -l)"
echo "[Backup] Done. Next run in 24h."
