start: setup docker launch

setup:
	cp .env.example .env
	npm i
	npm i -g bun
	npm run build

docker: docker-down
	docker run --name initiate-redis -d -p 6379:6379 redis

docker-down:
	docker stop initiate-redis || true
	docker rm initiate-redis || true

launch: docker
	source .env && npm start

stop: docker-down
	pm2 stop initiate-backend

dev:
	source .env.example && npm run dev

dev-restart: stop docker dev