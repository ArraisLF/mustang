# Projeto Mustang

Plataforma web para estudantes que se preparam para concursos públicos no Brasil.

## Stack

- **Frontend** (`mustang-frontend/`): React 19, Vite 7, Tailwind CSS, React Router 7, Axios — see `mustang-frontend/CLAUDE.md`
- **Backend** (`mustang-backend/`): Spring Boot 3.5, Java 21, Spring Security + JWT, JPA/Hibernate, PostgreSQL 16 — see `mustang-backend/CLAUDE.md`
- **Infrastructure**: Railway (deploy), Docker Compose (local DB)

## Conventions

- **UI always in Brazilian Portuguese** — all text, labels, messages, and placeholders must be in pt-BR
- Code and comments in English
- Environment variables for configuration
- **For each plan implemented**: create a new branch and open a pull request against `develop`

## Git Flow

- **`main`** — production branch, only updated via merges from `develop`
- **`develop`** — integration branch, all feature/hotfix PRs target this branch
- Branch prefixes: `feature/` for new features, `hotfix/` for urgent fixes
- Create branches from `develop`
- Commits follow Git best practices (clear, descriptive messages)
- No squash commits
- **Before opening a PR**:
  1. Run the full build with tests (`./mvnw verify` in backend, `npm run build` in frontend) and ensure everything passes
  2. Diff the branch against `develop` and check each changed file against the docs — update any spec, ADR, or CLAUDE.md that is now stale:
     - New or changed endpoints → update `mustang-backend/specs/api-contracts.md`
     - New or changed components → update `mustang-frontend/specs/components.md`
     - Changes to an existing feature's behavior → update the relevant `specs/*.md`
     - New architectural pattern or significant trade-off → add an ADR to `specs/architecture-decisions.md`
     - New convention, command, or package → update the relevant `CLAUDE.md` (root, backend, or frontend)
- When done, open a Pull Request to `develop`

## Submodules

- `mustang-frontend/` and `mustang-backend/` are git submodules of the root repository
- **Before starting any work**, run `git submodule update --remote` in the root repository to ensure submodules are up to date with the remote
- Commits and branches must be made **inside each submodule** (cd to the submodule directory)
- After committing inside a submodule, **always return to the root repository** and commit the updated submodule reference (`git add mustang-backend && git commit` or `git add mustang-frontend && git commit`)
- When creating branches for a feature that affects both projects, create the branch in each submodule individually

## Environment Variables

### Frontend
- `VITE_API_URL` — Backend API base URL

### Backend
- `DATABASE_URL` — PostgreSQL connection URL
- `DATABASE_USERNAME` — Database user
- `DATABASE_PASSWORD` — Database password
- `FRONTEND_URL` — Frontend URL (CORS)
- `JWT_SECRET` — Secret key for JWT tokens

## Database

```bash
docker-compose up         # Start local PostgreSQL
```

## Specs

Feature specifications and architecture decisions are documented in the `specs/` directory:
- `specs/auth.md` — Authentication & registration
- `specs/feed.md` — Feed & posts
- `specs/error-logging.md` — Client error logging
- `specs/architecture-decisions.md` — ADRs
- `mustang-backend/specs/api-contracts.md` — REST endpoint reference
- `mustang-frontend/specs/components.md` — Component inventory
