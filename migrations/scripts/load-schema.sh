#!/bin/bash
set -a
source .env
set +a

psql -U "$DB_USER" \
     -h "$DB_HOST" \
     -p "$DB_PORT" \
     -d "$DB_NAME" \
     -f migrations/initial_schema.sql