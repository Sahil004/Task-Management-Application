# Task Management Application

A full-stack task management application with JWT-based authentication and personal task tracking. The backend is implemented with Node.js, Express, TypeScript, and MongoDB. The frontend uses Next.js, Tailwind CSS, and Redux Toolkit for a responsive task dashboard with authentication, filtering, and task management flows.

## Project Overview

This project is being built to satisfy the assignment requirement for a task management application with:

- user registration and login
- JWT-protected task management routes
- task filtering and sorting
- dashboard statistics
- backend API documentation
- seed data and tests

The repository now contains both the backend API and a frontend client built around the same documented REST contract.

## Tech Stack

- Backend: Node.js, Express.js, TypeScript
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, Redux Toolkit
- Database: MongoDB with Mongoose
- Authentication: JWT, bcryptjs
- Validation: express-validator
- Documentation: Swagger / OpenAPI
- Testing: Jest, Supertest

## Repository Structure

```text
backend/
  src/
    app.ts
    server.ts
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    swagger/
    test/
    __tests__/
frontend/
  src/
    app/
    components/
    lib/
```

## Backend Features

- Register a user with name, email, and password validation
- Login with JWT token generation
- Logout endpoint for authenticated users
- Protected routes using bearer token authentication
- Get current authenticated user
- Create, read, update, delete, and reorder tasks
- Filter tasks by `status` and `priority`
- Sort tasks by `dueDate`, `createdAt`, `priority`, or `title`
- Dashboard summary with:
  - total tasks
  - grouped status counts
  - overdue task count
  - high-priority pending task count
- OpenAPI docs at `GET /api-docs` and raw spec at `GET /api-docs.json`
- Seed script for demo data
- Passing backend test suite

## Frontend Features

- Responsive Next.js interface with App Router
- Register and login flows wired to the backend REST API
- Redux-managed auth and task state
- Dashboard summary cards and workload pulse
- Mobile-friendly panel switching between task form and task board
- Task create, edit, delete, filter, and sort flows
- Priority badges and overdue indicators for visual scanning
- Confirmation modal before deletion

## Environment Variables

Copy [backend/.env.example](/c:/Sahil/Task-Management-Application/backend/.env.example) to `backend/.env` and fill in the values.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend server port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign JWT tokens. |
| `JWT_EXPIRES_IN` | No | JWT lifetime, for example `7d`. |
| `CLIENT_URL` | No | Allowed frontend origin for CORS. |
| `NODE_ENV` | No | Runtime mode such as `development` or `test`. |

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB running locally or a MongoDB Atlas connection string

### Install

```bash
cd backend
npm install
```

### Configure Environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017
JWT_SECRET=replace-with-a-secure-secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Run the Backend

```bash
cd backend
npm run dev
```

The API will start at `http://localhost:5000`.

## Frontend Setup

### Install

```bash
cd frontend
npm install
```

### Configure Environment

Create `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:3000`.

## Seed Data

Run the seed script:

```bash
cd backend
npm run seed
```

This creates a demo user and sample tasks.

Demo credentials after seeding:

- Email: `demo@taskflow.com`
- Password: `demo1234`

## Testing

Run the backend test suite:

```bash
cd backend
npm test
```

Build the TypeScript backend:

```bash
cd backend
npm run build
```

Type-check the frontend:

```bash
cd frontend
npx tsc --noEmit
```

## API Endpoints

### Auth

| Method | Endpoint | Description | Protected |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive JWT | No |
| `POST` | `/api/auth/logout` | Logout response; frontend should clear token | Yes |
| `GET` | `/api/auth/me` | Get current authenticated user | Yes |

### Tasks

| Method | Endpoint | Description | Protected |
| --- | --- | --- | --- |
| `GET` | `/api/tasks` | List current user tasks with filters/sorting | Yes |
| `POST` | `/api/tasks` | Create a task | Yes |
| `GET` | `/api/tasks/dashboard` | Dashboard summary statistics | Yes |
| `PATCH` | `/api/tasks/reorder` | Bulk reorder tasks for board views | Yes |
| `GET` | `/api/tasks/:id` | Get a single task | Yes |
| `PUT` | `/api/tasks/:id` | Update a task | Yes |
| `DELETE` | `/api/tasks/:id` | Delete a task | Yes |

### Task Query Parameters

`GET /api/tasks` supports:

- `status`: `todo`, `in-progress`, `done`
- `priority`: `low`, `medium`, `high`
- `sortBy`: `dueDate`, `createdAt`, `priority`, `title`
- `order`: `asc`, `desc`

## API Documentation

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

## Logout Behavior

This backend uses stateless JWT authentication. Because the token is not stored server-side, the logout endpoint returns a success response and the frontend is responsible for removing the JWT from local storage, session storage, or cookies depending on the client implementation.

## Screenshots / Demo

Suggested screenshots for submission:

- Landing page
- Login / register screens
- Dashboard with summary cards
- Task board with task form visible
- Mobile dashboard layout

The backend API is documented through Swagger for review and manual testing, and the frontend is now wired against that REST API.

## Additional Documentation

- Architecture notes: [ARCHITECTURE.md](/c:/Sahil/Task-Management-Application/ARCHITECTURE.md)
- Backend env template: [backend/.env.example](/c:/Sahil/Task-Management-Application/backend/.env.example)
- Frontend env template: [frontend/.env.example](/c:/Sahil/Task-Management-Application/frontend/.env.example)
