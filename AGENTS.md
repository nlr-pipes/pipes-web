# AGENTS.md — Agent Guide

## Project Overview

**pipes-web** is the frontend UI for the **PIPES** platform — **P**ipeline for **I**ntegrated **P**rojects in **E**nergy **S**ystems. PIPES is a project management, data management, and workflow management layer for integrated modeling teams.

This React application serves as a user-friendly web interface (targeted at non-developers) that consumes the REST APIs exposed by the PIPES API server (built with FastAPI). Key capabilities surfaced through the UI include:

- **Workspace management** — create, update, and track projects and project runs
- **Model management** — manage models and catalog models (including IFAC variants)
- **Dataset management** — manage catalog datasets, uploads, and sharing
- **Pipeline visualization** — interactive DAG pipeline view (ReactFlow + Dagre)
- **Schedule view** — Gantt chart for project milestones and timelines
- **Team & access management** — teams, access groups, and user administration
- **Handoffs** — data handoff tracking between models within a project
- **Authentication** — AWS Cognito-based login, registration, password flows, and JWT token management

---

## Architecture and Tech Stack

### Core Framework
| Layer | Technology |
|---|---|
| UI framework | React 18 |
| Routing | React Router DOM v6 |
| State management | Zustand (with `persist` middleware → `localStorage`) |
| Server state / data fetching | TanStack React Query v5 |
| HTTP client | Axios (with request/response interceptors) |
| Forms | React Hook Form |

### UI Component Libraries
| Purpose | Library |
|---|---|
| Component library | MUI (Material UI v5) + Emotion |
| CSS framework | Bootstrap 5 + React-Bootstrap |
| Icons | FontAwesome, Lucide React, React Icons |
| Pipeline graph | ReactFlow + Dagre (DAG layout) |
| Gantt chart | gantt-task-react |
| Color palettes | D3 |

### Authentication
- **AWS Cognito** via `amazon-cognito-identity-js`
- JWT tokens decoded with `jwt-decode`
- `AuthStore` (Zustand) manages session state, token refresh, and Cognito user pool interactions
- Axios interceptor automatically attaches `Authorization: Bearer <token>` to every API request and handles token expiry by logging out the user

### Environment Configuration
`src/configs/PipesConfig.js` selects the correct API origin and Cognito pool based on the `REACT_APP_ENV` environment variable:

| `REACT_APP_ENV` | API Base URL |
|---|---|
| `prod` | `https://pipes-api.nlr.gov` |
| `stage` | `https://pipes-api-stage.nlr.gov` |
| `dev` | `https://pipes-api-dev.nlr.gov` |
| *(unset / local)* | `http://localhost:8080` |

### Build & Serving
- **Development build:** multi-stage Docker image using `node:22-alpine` (builder) + `nginx:1.27-alpine` (server)
- **Production build:** multi-stage image using `node:22-alpine` (builder) + a custom NREL NGINX base image (`nrel-split-nginx`) from AWS ECR
- Static assets are served by NGINX; all routes fall back to `index.html` (SPA routing)

---

## Project Layout

```
pipes-web/
├── AGENTS.md                     # This file
├── package.json                  # npm dependencies and scripts
├── Makefile                      # Docker build/push targets (used by CI)
├── buildspec.yml                 # AWS CodeBuild pipeline definition
├── Dockerfile                    # Local dev Docker image
├── docker-compose.yaml           # Local dev compose (port 3030)
├── deployment/
│   └── Dockerfile                # Production Docker image (uses NREL NGINX base)
├── nginx/
│   └── development.conf          # NGINX config for local/dev container
├── public/                       # Static public assets (index.html, manifest, robots)
├── build/                        # Output of `npm run build` (gitignored in practice)
└── src/
    ├── App.js                    # Root component: routing, auth guard, layout composition
    ├── App.css                   # Global app styles
    ├── index.js                  # React entry point
    ├── index.css                 # Base CSS
    ├── configs/
    │   └── PipesConfig.js        # Per-environment API URL + Cognito pool config
    ├── contexts/
    │   └── NavigationContext.jsx # Active sidebar section state (persisted to localStorage)
    ├── hooks/                    # TanStack Query hooks (one per resource type)
    │   ├── AxiosInstance.js      # Configured Axios instance with auth interceptors
    │   ├── useProjectQuery.js
    │   ├── useProjectRunQuery.js
    │   ├── useModelQuery.js
    │   ├── useModelRunQuery.js
    │   ├── useCatalogModelQuery.js
    │   ├── useCatalogDatasetQuery.js
    │   ├── useDatasetQuery.js
    │   ├── useHandoffQuery.js
    │   ├── useTeamQuery.js
    │   ├── useAccessGroupQuery.js
    │   └── useUserQuery.js
    ├── stores/                   # Zustand global stores
    │   ├── AuthStore.js          # Auth state, Cognito session, token management
    │   ├── DataStore.js          # Effective project name (persisted)
    │   ├── UIStore.js            # UI state (colors, etc.)
    │   └── FormStore/            # Form-specific state slices
    ├── layouts/                  # Shell / chrome components
    │   ├── Banner.jsx            # Top banner (shown when unauthenticated)
    │   ├── Footer.jsx
    │   ├── NavbarFluid.jsx       # Top nav when authenticated
    │   ├── NavbarTop.jsx         # Top nav when unauthenticated
    │   ├── NavbarSide.jsx        # Collapsible sidebar (authenticated)
    │   ├── NavbarSub.jsx         # Sub-navigation bar
    │   └── styles/               # CSS for layout components
    └── pages/                    # Page-level components (one folder per domain)
        ├── Home/
        ├── Account/              # Login, register, password flows, profile, tokens
        ├── Projects/             # CRUD for projects
        ├── ProjectRuns/          # CRUD for project runs
        ├── Dashboard/            # Project dashboard
        ├── Pipeline/             # Pipeline DAG visualization
        ├── Schedule/             # Gantt schedule view
        ├── Milestones/           # Project milestones
        ├── Models/               # CRUD for models
        ├── CatalogModels/        # CRUD for catalog models (incl. IFAC variant pages)
        ├── CatalogDatasets/      # CRUD + sharing for catalog datasets
        ├── Handoffs/             # CRUD for handoffs
        ├── Teams/                # CRUD for teams
        ├── AccessGroups/         # CRUD for access groups
        ├── Users/                # User listing and editing
        ├── Components/           # Shared reusable components
        ├── FormStyles.css        # Shared form styles
        └── PageStyles.css        # Shared page styles
```

---

## Useful Commands

### Development

```bash
# Install dependencies
npm install

# Start local development server (hot-reload, default port 3000)
npm start

# Run tests (watch mode)
npm test

# Build production bundle into build/
npm run build
```

### Code quality

```bash
# Format with Prettier
npx prettier --write "src/**/*.{js,jsx,css}"

# Check formatting without writing
npx prettier --check "src/**/*.{js,jsx,css}"
```

---

## Release and Deployment

### Branch → Environment Mapping

| Git Branch | Environment | API Target |
|---|---|---|
| `master` | `prod` | `pipes-api.nlr.gov` |
| `stage` | `stage` | `pipes-api-stage.nlr.gov` |
| `develop` | `dev` | `pipes-api-dev.nlr.gov` |
| any other | `other` | `localhost:8080` |

### Release Workflow

1. Develop on feature branches, open PRs against `develop`.
2. Cut a `release` branch when ready, then merge it into both `develop` and `master`.
3. Create a semantic version tag (e.g., `v0.2.3`) and generate release notes on GitHub.

### CI/CD — AWS CodeBuild

`buildspec.yml` defines the build pipeline triggered by CodeBuild webhooks on PRs to `develop`, `stage`, and `master`:

1. **pre_build** — ECR login, resolve git SHA and branch name
2. **build** — `make build` (calls `docker build` via `deployment/Dockerfile`, passes `ENV_CONFIG` and `BASE_IMAGE_TAG` as build args)
3. **post_build** — `make push` (pushes image to AWS ECR) and writes `imageDetail.json`

The Docker image tag format is:
```
<ECR_REPO>:<CODEBUILD_BUILD_NUMBER>-<BASE_IMAGE_TAG>-<BRANCH_NAME>-<GIT_SHA>
```

### Deployment

After the Docker image is pushed to ECR, the site is deployed via a **Jenkins job** named `pipes-web` at NLR.

### Environment Variable Injection (Build-time)

`REACT_APP_ENV` is set as a Docker build arg (`ENV_CONFIG`) at build time. React embeds it into the static bundle at compile time — it is **not** a runtime environment variable. To target a specific environment, pass the correct value during `docker build`:

```bash
# Example: build for staging
docker build --build-arg ENV_CONFIG=stage -f deployment/Dockerfile .
```
