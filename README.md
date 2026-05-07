# 🛒 Laravel + React CRUD App

A Product Management System built with Laravel 12 (FrankenPHP) + React 19 + MySQL + Docker.

---

## 📋 Requirements

Make sure the following software is installed before you begin.

| Software | Version | Check |
|----------|---------|-------|
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Latest | `docker --version` |
| [Git](https://git-scm.com/) | Latest | `git --version` |

---

## 🚀 Running with Docker (Recommended)

### Step 1 — Clone the Repository

```bash
git clone <your-repo-url> CRUD
cd CRUD
```

---

### Step 2 — Start Docker Desktop

Open Docker Desktop and make sure it is running before continuing.

```powershell
docker --version
# Should print: Docker version 26.x.x
```

---

### Step 3 — Build All Images

```powershell
docker compose build --no-cache
```

> ⏳ The first build takes **3–5 minutes** as it downloads base images and installs dependencies.

---

### Step 4 — Start the Database First

```powershell
docker compose up -d db
```

Wait about **15 seconds** for MySQL to initialize, then verify it is healthy:

```powershell
docker compose ps db
```

```
NAME      STATUS
crud_db   Up (healthy)   ← Must show "healthy"
```

---

### Step 5 — Run Database Migrations

Creates the `products` table inside MySQL.

```powershell
docker compose run --rm migrate
```

Expected output:

```
Migrating: 2026_04_10_091426_create_products_table
Migrated:  2026_04_10_091426_create_products_table
```

---

### Step 6 — Start All Services

```powershell
docker compose up -d
```

Verify all containers are running:

```powershell
docker compose ps
```

```
NAME              STATUS
crud_db           Up (healthy)
crud_backend      Up
crud_frontend     Up
crud_nginx        Up
```

---

### Step 7 — Open in Browser

```
http://localhost:90
```

🎉 The Product Inventory app should now be visible.

---

## 🌐 API Endpoints

While Docker is running, you can test the API with the following URLs.

| Method | URL | Description |
|--------|-----|-------------|
| GET | `http://localhost:90/api/products` | List all products |
| GET | `http://localhost:90/api/products/1` | Get a single product |
| POST | `http://localhost:90/api/products` | Create a new product |
| PUT | `http://localhost:90/api/products/1` | Update a product |
| DELETE | `http://localhost:90/api/products/1` | Delete a product |

**Testing with curl:**

```powershell
# List all products
curl http://localhost:90/api/products

# Create a new product
curl -X POST http://localhost:90/api/products `
  -H "Content-Type: application/json" `
  -H "Accept: application/json" `
  -d '{"name":"iPhone 15","description":"Latest phone","price":999.99}'

# Update a product
curl -X PUT http://localhost:90/api/products/1 `
  -H "Content-Type: application/json" `
  -H "Accept: application/json" `
  -d '{"name":"iPhone 15 Pro","price":1199.99}'

# Delete a product
curl -X DELETE http://localhost:90/api/products/1
```

---

## 🛑 Stopping the App

```powershell
# Stop containers (data is preserved)
docker compose down

# Stop containers AND delete all database data
docker compose down -v
```

---

## 🔄 Rebuilding After Code Changes

**After changing backend (Laravel):**

```powershell
docker compose build --no-cache backend
docker compose up -d --force-recreate backend
```

**After changing frontend (React):**

```powershell
docker compose build --no-cache frontend
docker compose up -d --force-recreate frontend
```

---

## 📁 Project Structure

```
CRUD/
├── docker-compose.yml        ← Docker services configuration
├── nginx/
│   └── nginx.conf            ← Reverse proxy configuration
│
├── backend/                  ← Laravel 12 REST API
│   ├── Dockerfile            ← FrankenPHP container build
│   ├── Caddyfile             ← PHP server configuration
│   ├── .env.docker           ← Docker environment variables
│   ├── app/
│   │   ├── Models/
│   │   │   └── Product.php           ← Product Eloquent model
│   │   └── Http/Controllers/
│   │       └── ProductController.php ← CRUD logic
│   ├── routes/
│   │   └── api.php                   ← API route definitions
│   └── database/
│       └── migrations/               ← Database schema
│
└── frontend/                 ← React 19 App
    ├── Dockerfile
    ├── nginx.frontend.conf   ← Serves built React files
    └── src/
        ├── App.js            ← Main UI component
        ├── api.js            ← Axios API helper
        └── index.css         ← Styling
```

---

## 🐳 Docker Architecture

```
Browser → http://localhost:90
                │
                ▼
   ┌─────────────────────┐
   │  Nginx  (port 90)   │  ← Single entry point
   └──────┬──────────────┘
          │
      ┌───┴────────────┐
      │                │
    /api               /
      │                │
      ▼                ▼
 ┌──────────┐    ┌──────────┐
 │ Laravel  │    │  React   │
 │  :8080   │    │  :3000   │
 │(FrankenPHP)   │ (Nginx)  │
 └────┬─────┘    └──────────┘
      │
      ▼
 ┌──────────┐
 │  MySQL   │
 │  :3306   │
 └──────────┘
```

| Container | Image | Role |
|-----------|-------|------|
| `crud_nginx` | `nginx:alpine` | Reverse proxy — only public port (90) |
| `crud_backend` | Custom (FrankenPHP) | Runs Laravel PHP API |
| `crud_frontend` | Custom (Nginx) | Serves built React SPA |
| `crud_db` | `mysql:8.0` | Stores all product data |

---

## ❗ Troubleshooting

### "502 Bad Gateway" error

```powershell
# Check backend logs
docker compose logs backend

# Restart the backend
docker compose restart backend
```

### Migration fails

```powershell
# Check if the DB is healthy
docker compose ps db

# Wait 15 seconds then retry
docker compose run --rm migrate
```

### Port 90 is already in use

Change the port in `docker-compose.yml`:

```yaml
ports:
  - "8090:80"   # Use 8090 instead of 90
```

Then open: `http://localhost:8090`

### Full reset (clears everything)

```powershell
docker compose down -v
docker builder prune -f
docker compose build --no-cache
docker compose up -d db
docker compose run --rm migrate
docker compose up -d
```

---

## 📝 Useful Commands

```powershell
# View live logs (all services)
docker compose logs -f

# View logs for backend only
docker compose logs -f backend

# Open a shell inside the backend container
docker compose exec backend sh

# Run an Artisan command
docker compose exec backend php artisan <command>

# Fresh migration (drops all tables and re-runs)
docker compose exec backend php artisan migrate:fresh
```

---

## 💻 Local Development (Without Docker)

If you want to run the project locally without Docker:

### Backend

```powershell
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Edit .env: set DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD
php artisan migrate
php artisan serve --port=8000
# Runs at http://127.0.0.1:8000
```

### Frontend

```powershell
cd frontend
npm install
npm start
# Runs at http://localhost:3000
# Proxies /api requests to http://127.0.0.1:8000 (via package.json proxy)
```

---

## 🔑 Environment Variables (Docker)

The backend uses `.env.docker` inside Docker instead of the regular `.env`.

| Variable | Local value | Docker value |
|----------|------------|--------------|
| `DB_HOST` | `127.0.0.1` | `db` (service name) |
| `APP_URL` | `http://backend.test` | `http://localhost:90` |
| `SESSION_DRIVER` | `database` | `file` |
| `CACHE_STORE` | `database` | `file` |

---

*Built with ❤️ using Laravel 12 + React 19 + FrankenPHP + Docker*
