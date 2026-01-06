# HealTek — Authentication Service

Lightweight production-ready authentication service using Node.js, Express and MongoDB (Mongoose).

This repository implements JWT-based authentication with short-lived access tokens and rotating refresh tokens (refresh tokens are hashed in the DB). Passwords are hashed with bcrypt. Role-based access control is included (default role: `USER`).

---

**Quick facts**
- Access token TTL: default 15 minutes
- Refresh token TTL: default 7 days (configurable)
- Refresh tokens stored hashed in MongoDB
- Codebase uses ES modules ("type": "module")

---

**Prerequisites**
- Node.js 18+ (Node 22 tested)
- npm
- MongoDB (local or remote) or use in-memory DB option (not included by default)

**Important files**
- `backend/src` — application source
- `backend/src/server.js` — bootstrap and DB connect
- `backend/src/app.js` — Express app wiring
- `backend/src/modules` — `auth` and `user` modules (controllers/services/routes)
- `backend/test/integration.test.mjs` — simple integration test script
- `backend/.env` — local env (gitignored)

---

Setup
1. Install dependencies:

```bash
npm install
```

2. Create `backend/.env` (this file is in `.gitignore`) with values like:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/healtek_test
JWT_ACCESS_SECRET=replace_with_a_strong_random_value
JWT_REFRESH_SECRET=replace_with_another_strong_random_value
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
```

Generate the secrets with a secure RNG (for example, `openssl rand -hex 32`).

3. Start MongoDB and ensure `MONGO_URI` is reachable.

---

Run

Start server (production):

```bash
npm start
```

Start server (development, auto-reload):

```bash
npm run dev
```

If the default port 3000 is blocked use a different port:

```bash
# Git Bash / WSL
PORT=8080 npm run dev

# PowerShell
$env:PORT=8080; npm run dev
```

---

Integration tests

The project includes a minimal integration script that exercises the main auth flows (register → login → get /me → refresh → logout).

Run the tests after starting the server in another terminal:

```bash
npm run test:integration
```

To run tests against a custom base URL:

```bash
BASE_URL=http://localhost:8080 npm run test:integration
```

Notes:
- Tests use Node's global `fetch` (Node 18+ / Node 22 recommended).
- The integration test expects a running server and a reachable MongoDB.
- If you prefer not to run a real MongoDB, I can add `mongodb-memory-server` to run tests against an in-memory DB.

---

API Endpoints (summary)

- POST `/auth/register` — body: `{ email, password, name? }` — creates user and returns tokens
- POST `/auth/login` — body: `{ email, password }` — returns tokens
- POST `/auth/refresh` — body: `{ refreshToken }` — rotates refresh token and returns new tokens
- POST `/auth/logout` — body: `{ refreshToken }` — revokes refresh token
- GET `/me` — protected (Authorization: `Bearer <accessToken>`) — returns current user
- PUT `/me` — protected — update `name`, `email`, `password`

Example curl (register):

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}'
```

