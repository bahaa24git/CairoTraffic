# CairoTraffic - React + Express + SQLite Login

This version uses SQLite, the same simple file-based database style used by the uploaded `projecthub-api` project (`db.sqlite3`).

## Frontend

```bash
npm install
npm start
```

Runs on:

```txt
http://localhost:3000
```

## Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm start
```

Runs on:

```txt
http://localhost:5000
```

The backend automatically creates this SQLite database file:

```txt
backend/data/cairo_traffic.sqlite
```

## Test account

After running `npm run seed`:

```txt
Email: admin@cairotraffic.com
Password: Admin12345
```

## API endpoints

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
GET  /api/health
```

## Test register using Git Bash

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com","password":"123456"}'
```
