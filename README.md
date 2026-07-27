# Task Manager API

A secure backend REST API built with Next.js, Prisma, and JWT authentication.
Users register, log in, and manage their own tasks — with the same
security discipline you'd expect from a production client project.

## Features

**Auth**
- Register (bcrypt-hashed passwords)
- Login (JWT, 1h expiry)
- Rate limiting on register/login (5 attempts / 15 min)

**Tasks** (all protected, ownership-enforced)
- Create / list / update / delete
- Users can only ever access their own tasks

## Security notes

| Concern | Status | Notes |
|---|---|---|
| Password hashing | ✅ | bcrypt, 10 salt rounds — passwords never stored in plain text |
| SQL injection | ✅ | Prisma uses parameterized queries by default |
| Input validation | ✅ | Zod schemas on every route — type-checked, trimmed, normalized |
| JWT expiration | ✅ | Tokens expire after 1 hour |
| IDOR protection | ✅ | Every task route checks `task.userId === req.user.id` before allowing access — manually verified: User A blocked (403) from editing/deleting User B's task |
| User enumeration | ✅ | Login returns identical error for "no such user" and "wrong password" |
| Rate limiting | ⚠️ Basic | In-memory, per-IP. Resets on server restart; wouldn't scale across multiple instances without Redis — acceptable trade-off for this project's scope |

## Tech stack

- Next.js (App Router) — REST API routes
- Prisma + SQLite — ORM and database
- bcryptjs — password hashing
- jsonwebtoken — auth tokens
- Zod — input validation

## Running locally

\`\`\`bash
git clone https://github.com/ouhassna/task-manager-api task-manager
cd task-manager
npm install

# create .env with:
# DATABASE_URL="file:./manager.db"
# JWT_SECRET="<generate with: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\">"

npx prisma migrate dev
npm run dev
\`\`\`

## API endpoints

| Method | Endpoint | Auth required | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Create an account |
| POST | /api/auth/login | No | Get a JWT |
| POST | /api/tasks | Yes | Create a task |
| GET | /api/tasks | Yes | List your own tasks |
| PUT | /api/tasks/:id | Yes | Update your own task |
| DELETE | /api/tasks/:id | Yes | Delete your own task |

## Testing

A Postman collection is included (\`task-manager.postman_collection.json\`)
covering every endpoint, including the IDOR test (attempting to modify
another user's task).