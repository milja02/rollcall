# RollCall

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
