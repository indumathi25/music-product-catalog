.PHONY: up down logs db-migrate db-deploy db-seed test lint clean

# Commands
COMPOSE := docker compose
BACKEND := $(COMPOSE) exec backend
NPM     := npm --prefix

# --- Docker Lifecycle ---
up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

# --- Database ---
db-migrate:
	$(BACKEND) npx prisma migrate dev 

db-deploy:
	$(BACKEND) npx prisma migrate deploy

db-seed:
	$(BACKEND) npx tsx prisma/seed.ts

# --- Quality ---
test:
	$(NPM) backend test
	$(NPM) frontend test

lint:
	$(NPM) backend run lint
	$(NPM) frontend run lint

# --- Cleanup ---
clean:
	$(COMPOSE) down -v --remove-orphans
	docker image prune -f
