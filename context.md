# Project context

## What this is

Single-page **todo list** app: add items, toggle complete, delete, filter (all / active / completed). State lives **only in React memory** — a full page reload clears the list.

## Stack

- **React 19** + **TypeScript**
- **Vite 6** for dev server and production build
- **Styling:** custom CSS with a **cyberpunk** theme (neon cyan/magenta, Orbitron + JetBrains Mono via Google Fonts)
- **Production container:** multi-stage **Docker** build (Node builds static assets; **nginx** serves `dist/` on port 80)

## Local development

```bash
npm install
npm run dev
```

Vite defaults to `http://localhost:5173` (or the next free port).

Typecheck + production bundle:

```bash
npm run build
```

## Docker

- **`Dockerfile`:** `npm ci` → `npm run build` → copy `dist` into nginx Alpine.
- **`nginx.conf`:** SPA fallback (`try_files` → `index.html`), gzip, long cache for `/assets/`.
- **`.dockerignore`:** keeps `node_modules` and `dist` out of the build context.

Build and run without Compose:

```bash
docker build -t todo-app .
docker run --rm -p 8080:80 todo-app
```

## Docker Compose + Traefik

`docker-compose.yml` targets deployment behind **Traefik**:

- Service **`web`** builds from `.`, attaches to external network **`traefik`** (must exist; name your stack actually uses — use `networks.traefik.name` if the Docker network name differs).
- Labels route **`todo.ineedparts.co.uk`** on **`websecure`** with TLS and **`letsencrypt`** cert resolver (resolver name must match Traefik static config).
- **`traefik.docker.network`** must equal the **real** Docker network name Traefik uses to reach this container.

Adjust host, network name, or cert resolver names to match your infrastructure before deploying.

## Repository

Remote: `https://github.com/axi82/todo.git` (branch `main`).

## Main source files

| Area        | Files |
|------------|--------|
| App + logic | `src/App.tsx`, `src/App.css` |
| Global theme / layout | `src/index.css`, `index.html` |
| Entry      | `src/main.tsx` |


## Infrastructure

- Hosted on a VPS using Dokploy
- Reverse proxy: Traefik (managed by Dokploy)
- SSL: Let's Encrypt via Traefik
- Domain: ineedparts.co.uk
- Subdomains used per service (e.g. todo.ineedparts.co.uk)