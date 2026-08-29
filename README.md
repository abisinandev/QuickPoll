# QuickPoll

A real-time polling room: join with just a nickname (no password, no email), vote on live polls, and watch the results and everyone else's votes update instantly across every connected client, alongside a live group chat. Built as a TypeScript monorepo with an Express + Socket.IO backend and a Vite + React frontend, styled in a stark black/white "terminal" aesthetic.

## Tech stack

**Backend:** Node.js, Express, TypeScript, MongoDB (Mongoose), Socket.IO, `express-session` + `connect-mongo`, Zod
**Frontend:** React 18, Vite, TypeScript, Tailwind CSS v4, React Router, `socket.io-client`, Axios

## How it works

There's no signup — a visitor picks a display name, and `POST /api/users/join` creates or reuses a `User` with that (case-insensitive) username. The user's Mongo `_id` is stored in an `express-session` cookie backed by `connect-mongo`; that session is the entire auth model. The same session middleware is attached to the Socket.IO engine, so a socket connects using the same cookie — no separate login handshake, and sockets with no session are dropped.

Voting is a normal REST call, validated and persisted server-side (one vote per user per poll, enforced by a unique DB index). The recomputed poll — vote counts, percentages, total — is then broadcast to every connected client over `poll:updated`, so one guest's vote updates everyone else's screen instantly. Chat works the same way but lives entirely on the socket: sending, typing indicators, and the online-user count are all socket events, with REST used only to load initial history.

## Features

- Guest join via nickname + session cookie — no passwords or accounts
- Live polls with server-enforced single-vote-per-user, broadcast to all clients in real time
- Real-time group chat with typing indicators and a live online-user count
- Session-authenticated Socket.IO (shares the Express session, no separate socket login)
- Protected routing (`/` requires a session, `/join` redirects away if already signed in)
- Dark/light theme toggle
- Leave/end-session flow that destroys the session and disconnects the socket

## Architecture

**Backend** is a layered Express app wired by hand-rolled dependency injection ([`backend/src/utils/containers.ts`](backend/src/utils/containers.ts)):

```
routes → controllers → services → repositories → mongoose models
```

Routes map paths to controllers and attach `requireAuth` where needed. Controllers just parse `req`/`res` and shape a uniform `{ success, message, data }` response. Services hold all business rules (vote validation, username checks, message limits) and depend only on repository interfaces. Repositories are the sole layer touching Mongoose. `SocketService` shares the same session middleware, tracks online users in memory, and is injected into `PollService` only so a successful vote can call `emitPollUpdated(...)`.

**Frontend** is a standard Vite + React SPA. `AuthContext` owns the session and drives routing between `/join` and `/`. A single module-scoped `socket` instance (`autoConnect: false`) is connected/disconnected by page-level effects. `apiClient` wraps Axios with `withCredentials: true` and normalizes every response into one `ApiResponse<T>` shape. Styling is plain Tailwind, no component library.

## Project structure

```
QuickPoll/
├─ backend/src/
│  ├─ configs/        # Mongo connection, session store
│  ├─ controllers/    # chat, poll, user
│  ├─ middlewares/    # requireAuth, error handler
│  ├─ models/         # User, Poll, Vote, Message
│  ├─ repositories/   # data access + interfaces
│  ├─ services/       # business logic + interfaces
│  ├─ routes/         # Express routers
│  ├─ utils/          # env-config, DI container, seed-polls, constants
│  ├─ app.ts          # Express app setup
│  └─ server.ts       # boots Mongo, DI, routers, http+socket server
└─ frontend/src/
   ├─ api/            # axios calls (auth, poll, chat)
   ├─ components/     # PollCard, GroupChat, Header, JoinForm, ...
   ├─ pages/          # JoinPage, QuickPollPage
   ├─ routes/         # AppRoutes, ProtectedRoute
   ├─ socket/         # shared socket.io-client instance
   ├─ store/          # AuthContext, ThemeContext
   └─ utils/          # apiClient, avatar color hashing
```

## Data model

| Model | Key fields | Notes |
|---|---|---|
| **User** | `username` (unique), `createdAt`, `lastSeenAt` | Re-joining with an existing username reuses the same document. |
| **Poll** | `question`, `options: [{ _id, text }]`, `isActive` | Votes reference an option's own subdocument `_id`. |
| **Vote** | `userId`, `pollId`, `optionId` | Unique index on `{userId, pollId}` — DB-level, one vote per poll. |
| **Message** | `userId`, `message` (≤200 chars) | Indexed on `createdAt` for recent-history lookups. |

## REST API

All responses: `{ success, message, data? }`. ✅ = requires a valid session.

| Method | Path | Auth | Description |
|---|---|:-:|---|
| `GET` | `/api/health` | | Liveness check |
| `POST` | `/api/users/join` | | Create/reuse a guest user, start session (`{ username }`) |
| `GET` | `/api/users/me` | | Current session's user |
| `POST` | `/api/users/leave` | | Destroy session |
| `GET` | `/api/polls` | | List active polls with live vote counts + your vote |
| `POST` | `/api/polls/:pollId/vote` | ✅ | Cast a vote (`{ optionId }`), broadcasts `poll:updated` |
| `GET` | `/api/chat/messages?limit=50` | ✅ | Recent chat history |

**Socket.IO events:** `poll:updated` (server→all), `chat:send`/`chat:message`, `chat:typing`/`chat:stopTyping` → `chat:userTyping`/`chat:userStoppedTyping`, `chat:onlineUsers`.

## Getting started

```bash
# 1. install
cd backend && npm install
cd ../frontend && npm install

# 2. configure env vars (see below), then run
cd backend && npm run dev     # http+socket server
cd frontend && npm run dev    # Vite dev server
```

### Environment variables

**`backend/.env`**

| Variable | Notes |
|---|---|
| `PORT` | default `4000` |
| `NODE_ENV` | `development` \| `production` \| `test` — controls cookie security & CORS |
| `MONGO_URL` | app data + session store |
| `SESSION_SECRET` | signs the session cookie |
| `FRONTEND_URL` | must match the deployed frontend origin (CORS + Socket.IO) |

**`frontend/.env`**

| Variable | Notes |
|---|---|
| `VITE_BACKEND_URL` | base URL for REST + Socket.IO client |

### Build

```bash
cd backend && npm run build   # tsc -> dist/, run with npm start
cd frontend && npm run build  # tsc -b && vite build -> dist/
```

## License

MIT — see [LICENSE](LICENSE).
