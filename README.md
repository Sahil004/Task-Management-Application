# Task Management Application

A full-stack task management application with JWT-based authentication and personal task tracking. The backend is implemented with Node.js, Express, TypeScript, and MongoDB. It supports authentication, protected task CRUD operations, dashboard statistics, OpenAPI documentation, and seed/test tooling.

## Project Overview

This project is being built to satisfy the assignment requirement for a task management application with:

- user registration and login
- JWT-protected task management routes
- task filtering and sorting
- dashboard statistics
- backend API documentation
- seed data and tests

The current repository contains a completed backend foundation and is structured so the frontend can be added cleanly on top of the documented API contract.

## Tech Stack

- Backend: Node.js, Express.js, TypeScript
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

Frontend screenshots or a demo GIF/video can be added here once the UI is completed. The backend API is already documented through Swagger for review and manual testing.

## Additional Documentation

- Architecture notes: [ARCHITECTURE.md](/c:/Sahil/Task-Management-Application/ARCHITECTURE.md)
- Backend env template: [backend/.env.example](/c:/Sahil/Task-Management-Application/backend/.env.example)

