.PHONY: web web-dev web-build web-preview dev

web:
	@$(MAKE) -s web-dev

web-dev:
	@echo "[web] starting dev server..."
	@cd apps/web && if [ -f package.json ]; then npm install >/dev/null 2>&1 || npm install; fi && npm run dev

web-build:
	@echo "[web] building..."
	@cd apps/web && npm run build

web-preview:
	@echo "[web] preview..."
	@cd apps/web && npm run preview

dev: web-dev

.PHONY: api api-dev api-start

api:
	@$(MAKE) -s api-dev

api-dev:
	@echo "[api] installing deps & starting..."
	@cd apps/api && if [ -f package.json ]; then npm install >/dev/null 2>&1 || npm install; fi && npm run dev

api-start:
	@echo "[api] starting in production..."
	@cd apps/api && npm run start
