.PHONY: up down re test add_mock_data_into_db

# -V = fresh node_modules volume
up:
	docker compose up --build -d -V
	@echo ""
	@echo "API: http://localhost:3003"
	@echo "Frontend: http://localhost:3000"

down:
	docker compose down

re: down up

# needs "make up" running first (tests hit the "db" container by hostname)
test:
	docker compose exec api npm run test:e2e

# wipes data and reloads mock_data.js 
# NOTE :  needs "make up" running first
add_mock_data_into_db:
	./scrypts/mock_data/mock_data.sh
