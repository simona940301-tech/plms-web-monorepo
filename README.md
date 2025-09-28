PLMS Monorepo

This repo combines frontend and backend code so changes can land in a single commit.

Currently it contains the web app imported via Git subtree.

- Apps
  - `apps/web` — Vite-based web frontend (imported from `plms-platform-backend` for now)

Remotes configured for subtree operations:
- `web` → https://github.com/simona940301-tech/plms-web.git (target frontend repo)
- `web-platform` → https://github.com/simona940301-tech/plms-platform-backend.git (current source of web code)

Quick Start

- Web dev
  - `make web-dev` — run Vite dev server in `apps/web`
  - `make web-build` — build web
  - `make web-preview` — preview build

Subtree sync (history preserved)

The web app was imported from `web-platform` into `apps/web`.

- Pull latest from `web-platform` into `apps/web`:
  - `./scripts/subtree-pull-web-platform.sh`
- Push changes in `apps/web` back to `web-platform`:
  - `./scripts/subtree-push-web-platform.sh`

Note: The `web` remote points to the new desired frontend repo (`plms-web`). When the new repo is ready, we can either:
- Re-import it into `apps/web` (replace contents), or
- Keep `apps/web` as the source of truth and push into `web` instead of `web-platform`.

Conventions

- Only work under `apps/*` in this monorepo.
- The original source repos were moved to `_source-archives/` to avoid confusion.
- Keep the working tree clean before running subtree operations.

