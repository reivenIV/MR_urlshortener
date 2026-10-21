#!/bin/sh
# Wipes urls/tags/tags_urls/url_clicks and reloads them with mock data.
# Needs "make up" running first (talks to the "db" container).
set -e
cd "$(dirname "$0")/../.."

USER=$(grep POSTGRES_USER .env | cut -d= -f2)
DB=$(grep POSTGRES_DB .env | cut -d= -f2)

docker compose exec -T db psql -v ON_ERROR_STOP=1 -U "$USER" -d "$DB" < scrypts/mock_data/mock_data.sql
URLS=$(docker compose exec -T db psql -U "$USER" -d "$DB" -t -c 'SELECT count(*) FROM urls;' | tr -d ' ')
TAGS=$(docker compose exec -T db psql -U "$USER" -d "$DB" -t -c 'SELECT count(*) FROM tags;' | tr -d ' ')
TAGS_URLS=$(docker compose exec -T db psql -U "$USER" -d "$DB" -t -c 'SELECT count(*) FROM tags_urls;' | tr -d ' ')
CLICKS=$(docker compose exec -T db psql -U "$USER" -d "$DB" -t -c 'SELECT count(*) FROM url_clicks;' | tr -d ' ')
echo "Seeded: $URLS urls, $TAGS tags, $TAGS_URLS tags_urls, $CLICKS url_clicks"
