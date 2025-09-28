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

