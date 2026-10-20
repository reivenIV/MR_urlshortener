.PHONY: up down re

# -V = fresh node_modules volume
up:
	docker compose up --build -d -V
	@echo ""
	@echo "API: http://localhost:3003"

down:
	docker compose down

re: down up
