.PHONY: up down restart logs db-migrate db-deploy db-seed test lint clean

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

db-migrate:
	docker compose exec backend npx prisma migrate dev 

db-deploy:
	docker compose exec backend npx prisma migrate deploy

db-seed:
	docker compose exec backend npx tsx prisma/seed.ts

test:
	cd backend && npm test
	cd frontend && npm test

lint:
	cd backend && npm run lint
	cd frontend && npm run lint

clean:
	docker compose down -v --remove-orphans
	docker image prune -f
