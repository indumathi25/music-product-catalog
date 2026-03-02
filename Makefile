.PHONY: up down logs test lint db-migrate db-seed db-migrate-dev db-seed-dev clean help

COMPOSE := docker compose

# ── Docker Lifecycle
up: env-check
	$(COMPOSE) up --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

# ── Database
db-migrate:
	$(COMPOSE) exec backend npx prisma migrate deploy

db-seed:
	$(COMPOSE) exec backend npx tsx prisma/seed.ts

db-migrate-dev:
	$(COMPOSE) exec backend npx prisma migrate dev

db-seed-dev:
	$(COMPOSE) exec backend npx tsx prisma/seed.ts

# ── Quality
test:
	cd backend && npm test
	cd frontend && npm test

lint:
	cd backend && npm run lint
	cd frontend && npm run lint

# ── Cleanup
clean:
	$(COMPOSE) down -v --remove-orphans
	docker image prune -f

# ── Initialization
env-check:
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
	fi

help:
	@echo "Available commands:"
	@echo "  make up             - Build and start the environment (configured in .env)"
	@echo "  make down           - Stop the environment"
	@echo "  make logs           - Stream container logs"
	@echo "  make db-migrate     - Run production migrations"
	@echo "  make db-migrate-dev - Run development migrations"
	@echo "  make db-seed        - Seed production database"
	@echo "  make db-seed-dev    - Seed development database"
	@echo "  make clean          - Deep cleanup of containers, volumes and images"
