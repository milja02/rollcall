# RollCall

[![CI/CD](https://github.com/woooooah/rollcall/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/woooooah/rollcall/actions/workflows/ci-cd.yml)

**Live app:** https://glowing-rolypoly-f14b7a.netlify.app (the backend runs on Render's free plan, so the first request after a period of inactivity can take up to a minute)

A web application for scheduling educational programmes, assigning lecturers and keeping a record of which lessons were actually delivered.

The application has three roles. The **administrator** manages accounts, the **coordinator** manages programmes, lessons, assignments and confirmations, and the **lecturer** works in a calendar and reports attendance.

## Technology stack

| Layer             | Technologies                                                                                 |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Frontend          | React with Vite, React Router, TailwindCSS, Recharts                                         |
| Backend           | Python 3.12, Django, Django REST Framework                                                   |
| Database          | PostgreSQL 16                                                                                |
| Authentication    | Django sessions with an HttpOnly cookie, custom DRF permission classes for role-based access |
| Local development | Docker Compose, Visual Studio Code                                                           |
| Version control   | Git, GitHub                                                                                  |

## Repository layout

```
.
├── frontend/   # React client, built with Vite
├── backend/    # Django and DRF server
└── docs/       # project documentation and architecture decision records
```

## Architecture decision records

Significant architecture decisions are recorded in [docs/adr](docs/adr/) using the [MADR](https://adr.github.io/madr/) format.

| ADR                                                               | Decision                                                      | Status   |
| ----------------------------------------------------------------- | ------------------------------------------------------------- | -------- |
| [0001](docs/adr/0001-locena-odjemalec-streznik-arhitektura.md)    | Separate client and server with a REST API                    | accepted |
| [0002](docs/adr/0002-django-in-drf-za-backend.md)                 | Django and Django REST Framework for the server side          | accepted |
| [0003](docs/adr/0003-postgresql-za-podatkovno-bazo.md)            | PostgreSQL as the database                                    | accepted |
| [0004](docs/adr/0004-sejna-avtentikacija-s-httponly-piskotkom.md) | Session authentication with an HttpOnly cookie instead of JWT | accepted |
| [0005](docs/adr/0005-docker-compose-za-lokalno-okolje.md)         | Docker Compose for the local development environment          | accepted |

## Run with Docker

Run `docker compose up --build` from the repository root

Ports 5173, 8000 and 5433 must be free.

The password for all accounts is demo12345:

- `admin@rollcall.test`
- `coordinator@rollcall.test`
- `lecturer@rollcall.test` and `lecturer2@rollcall.test`

## CI/CD pipeline

The pipeline is defined in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) and runs on every pull request to `main` and on every push to `main`. The `main` branch is protected: changes are merged through pull requests, and `lint`, `build` and `test` must pass before merging.

| Job      | What it does                                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lint`   | Checks code style and quality with ESLint (frontend, `eslint.config.js`) and Ruff (backend, `pyproject.toml`).                                                                                |
| `build`  | Builds the frontend with Vite and the backend as a Docker image. npm and pip dependencies are cached. The results (`frontend-dist`, `backend-build`) are uploaded as artifacts.            |
| `test`   | Runs the frontend tests (Vitest) and the backend tests (Django test runner against a PostgreSQL service container). Coverage reports are uploaded as artifacts.                            |
| `deploy` | Runs only on a push to `main` after the other three jobs succeed. It uses the artifacts from `build`: the backend image is pushed to GitHub Container Registry and deployed to Render (with a Render PostgreSQL database), and the frontend is deployed to Netlify. Netlify forwards `/api/*` to the backend, whose URL is set with the `BACKEND_URL` variable. Secrets are stored in the `production` environment. |

### Running tests locally

```
cd frontend && npm test
cd backend && DB_NAME=rollcall DB_USER=rollcall DB_PASSWORD=rollcall DB_PORT=5433 python manage.py test
```

The backend tests need the database from `docker compose` to be running.
