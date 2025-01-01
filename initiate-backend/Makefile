start: setup launch

setup:
	cp .env.example .env
	npm i
	npm i -g bun
	npm run build

launch:
	source .env && npx bun run src/index.ts

dev:
	source .env.example && npm run dev