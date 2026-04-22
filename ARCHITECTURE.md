# Architecture Notes

## Overview

The application is designed as a separated full-stack system with the backend exposed as a REST API and the frontend consuming that API over HTTP. This separation keeps the API independently testable, simplifies deployment, and makes the service reusable for multiple clients.

The architecture uses two independent apps in one repository:

- `backend`: Node.js + Express + MongoDB API
- `frontend`: Next.js + Redux UI client

## Folder Structure Rationale

### Backend structure (`backend/src`)

- `app.ts`
  Creates and configures the Express application with middleware, routes, Swagger docs, and error handling.
- `server.ts`
  Starts the HTTP server and initializes the database connection.
- `config/`
  Shared infrastructure configuration such as MongoDB connection logic.
- `models/`
  Mongoose schema definitions for domain entities.
- `controllers/`
  Request handlers that implement business logic and HTTP responses.
- `routes/`
  Route declarations and OpenAPI annotations.
- `middleware/`
  Authentication, validation, and centralized error handling.
- `scripts/`
  Utility scripts such as database seeding.
- `swagger/`
  Shared OpenAPI configuration and reusable schema components.
- `test/` and `__tests__/`
  Jest setup and HTTP-level route tests.

This keeps the code easy to navigate and avoids mixing transport concerns with persistence logic.

### Frontend structure (`frontend/src`)

- `app/`
  Next.js App Router entries for auth pages and dashboard pages.
- `components/`
  Reusable UI and feature components (`TaskBoard`, `TaskForm`, `Navbar`, `ConfirmDialog`, auth forms, shared UI fields).
- `lib/store/`
  Redux slices for auth, tasks, and theme.
- `lib/`
  API client, app types, token persistence helpers, and shared task option metadata/constants.

This separation keeps pages thin, pushes reusable UI into components, and centralizes stateful business actions in Redux async thunks.

## Database Schema Design

### User

The `User` model stores:

- `name`
- `email`
- `password`
- timestamps

Important design decisions:

- `email` is unique and normalized to lowercase
- `password` is stored hashed using bcrypt
- password is excluded from normal query output using `select: false`
- a schema method is used for password comparison

### Task

The `Task` model stores:

- `user`
- `title`
- `description`
- `priority`
- `status`
- `dueDate`
- `position`
- timestamps

Important design decisions:

- each task belongs to one user via `user`
- `priority` and `status` are constrained through enums
- `position` supports ordered list and Kanban-style reordering
- an `isOverdue` virtual is computed for API consumers

Indexes were added for common access patterns:

- `{ user: 1, status: 1 }`
- `{ user: 1, priority: 1 }`
- `{ user: 1, dueDate: 1 }`
- `{ user: 1, createdAt: -1 }`

These support user-scoped filtering and sorting, which is the primary task query path in the application.

## Authentication Flow

Authentication uses JWT bearer tokens:

1. A user registers or logs in through `/api/auth/register` or `/api/auth/login`.
2. On success, the server returns a signed JWT containing the user id.
3. The frontend stores the token and sends it in the `Authorization: Bearer <token>` header.
4. Protected routes use authentication middleware to verify the token and load the user.
5. Controllers rely on `req.user` to scope queries to the authenticated user.

The logout route is intentionally lightweight because the current backend uses stateless JWT authentication. The server responds successfully, and the client completes logout by deleting the stored token. This keeps the design simple and aligns with the assignment requirement to clear the session/token.

## Frontend Data Flow

1. Auth forms dispatch Redux thunks (`registerUser`, `loginUser`) that call backend auth endpoints.
2. On success, token/user are persisted via storage helpers and Redux state is hydrated on app load.
3. Protected pages use `AuthRedirect` and route replacement to guard dashboard/task pages.
4. Task pages dispatch async thunks (`fetchTasks`, `createTask`, `updateTask`, `deleteTask`, `reorderTasks`) that call the REST API with bearer token headers.
5. Dashboard and board views consume normalized task state and render visual status/priority indicators.

## API Design Decisions

The backend follows REST-style conventions:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/tasks`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

Additional endpoints were added for practical UX needs:

- `GET /api/tasks/dashboard`
- `PATCH /api/tasks/reorder`

HTTP status codes are used consistently for success, validation errors, unauthorized access, missing resources, and duplicate records.

## Validation and Error Handling

Validation is implemented with `express-validator` at the route layer before controller logic runs. This prevents malformed input from reaching business logic or the database layer.

Centralized error middleware handles:

- validation errors
- duplicate key errors
- invalid ObjectId casts
- generic server errors

This reduces repetitive error handling inside controllers and keeps API responses more consistent.

## Testing Strategy

The backend includes Jest and Supertest-based tests focused on route behavior and contract validation. In this environment, mocked model tests were chosen over in-memory Mongo integration tests because process restrictions prevented Mongo child processes from starting reliably.

This trade-off keeps CI and local verification lightweight while still validating:

- auth route behavior
- task route behavior
- health endpoint behavior
- OpenAPI contract exposure

If needed later, opt-in integration tests can be added against a real MongoDB instance via environment variables.

## Trade-offs

### Chosen trade-offs

- Stateless JWT logout instead of token blacklisting
  Simpler and sufficient for assignment scope, but does not support forced token revocation.
- Layered folder structure instead of feature modules
  Easy to understand for a small-to-medium assignment codebase.
- Route-level mocked tests instead of full DB integration tests
  More reliable in restricted environments and fast to run.
- Swagger annotations placed with routes
  Keeps endpoint definitions and documentation close together.

### Future improvements

- Add pagination and text search on the task list endpoint
- Add refresh tokens or token revocation if session invalidation is required
- Add Docker and CI workflows
- Generate frontend API types from the OpenAPI schema
- Add frontend screenshots and deployment details for final submission package
