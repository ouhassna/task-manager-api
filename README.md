# Task Manager API

A secure backend REST API built with Next.js, Prisma, and JWT authentication.
Users register, log in, and manage their own tasks — with the same
security discipline you'd expect from a production client project.

## Tech Stack
Next.js (App Router) · Prisma · SQLite · JWT · bcrypt · Zod

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

## Getting Started

\`\`\`bash
git clone https://github.com/ouhassna/task-manager-api
cd task-manager
npm install
npx prisma migrate dev
npm run dev
\`\`\`

## API Endpoints

| Method | Route | Description | Auth required |
|---|---|---|---|
| POST | /api/register | Create a new user | No |
| POST | /api/login | Log in, returns JWT | No |
| POST | /api/tasks | Create a task | Yes |
| GET | /api/tasks | List your tasks | Yes |
| PUT | /api/tasks/:id | Update a task (owner only) | Yes |
| DELETE | /api/tasks/:id | Delete a task (owner only) | Yes |

## Testing

A Postman collection is included (`task-manager.postman_collection.json`) — import it and test every endpoint in under 2 minutes.

## Why I built it this way

This project isn't just a CRUD exercise — I hold an eJPT (eLearnSecurity Junior Penetration Tester) certification, and I built this the way I'd want a client's backend built: secure by default, not patched after the fact. The security notes table above isn't decoration — every row was manually tested, not assumed.