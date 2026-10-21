.PHONY: up down re test

# -V = fresh node_modules volume
up:
	docker compose up --build -d -V
	@echo ""
	@echo "API: http://localhost:3003"

down:
	docker compose down

re: down up

# needs "make up" running first (tests hit the "db" container by hostname)
test:
	docker compose exec api npm run test:e2e
