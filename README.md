# Marillac Place

## Stack

**Backend Language:** TypeScript (Express.js on Node.js)
**Backend API:** GraphQL
**Database:** PostgreSQL

The provided frontend is a React application written in TypeScript.

## Table of Contents

- 🧰 [Useful Commands](#useful-commands)
  - ℹ️ [Get Names & Statuses of Running Containers](#get-names--statuses-of-running-containers)
  - 💽 [Accessing PostgreSQL Database](#accessing-postgresql-database)
  - ✨ [Linting & Formatting](#linting--formatting)
  - 🧪 [Running Tests](#running-tests)
- 🌳 [Version Control Guide](#version-control-guide)
  - 🌿 [Branching](#branching)
  - 🔒 [Commits](#commits)

### Prerequisites

1. Comment out one of the backend services in `docker-compose.yml`
2. In the root `.env` file, change the name of the MongoDB database according to the backend you're using: either `typescript-test` or `python-test`
3. Go into ./backend/typescript and create a .env file
4. In the .env file add the DATABASE_URL
   - If on MacOS replace username with your user which can be found in Finder (Finder -> Go -> Home)
   - If on Windows replace '<USERNAME' with 'postgres'

```
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@localhost:5432/scv2
```

1. Run the application

```bash
docker-compose up --build
```

The backend runs at http://localhost:5000 and the frontend runs at http://localhost:3000. By default, we use GraphQL (with TypeScript backend), REST (with Python backend), MongoDB, with user auth.

## Useful Commands

### Get Names & Statuses of Running Containers

```bash
docker ps
```

### Accessing PostgreSQL Database

```bash
# run a bash shell in the container
docker exec -it scv2_db /bin/bash

# in container now
psql -U postgres -d scv2

# in postgres shell, some common commands:
# display all table names
\dt
# quit
\q
# you can run any SQL query, don't forget the semicolon!
SELECT * FROM <table-name>;
```

### Linting & Formatting

Python backend:

```bash
docker exec -it scv2_py_backend /bin/bash -c "black ."
```

TypeScript backend and frontend:

```bash
# linting & formatting warnings only
docker exec -it scv2_ts_backend /bin/bash -c "yarn lint"

# linting with fix & formatting
docker exec -it scv2_ts_backend /bin/bash -c "yarn fix"
```

### Running Tests

Python backend:

```bash
docker exec -it scv2_py_backend /bin/bash -c "pip install -e . && pytest"
```

TypeScript backend and frontend:

```bash
docker exec -it scv2_ts_backend /bin/bash -c "yarn test"
```

## Version Control Guide

### Branching

- Branch off of `main` for all feature work and bug fixes, creating a "feature branch". Prefix the feature branch name with your name. The branch name should be in kebab case and it should be short and descriptive. E.g. `sherry/readme-update`
- To integrate changes on `main` into your feature branch, **use rebase instead of merge**

```bash
# currently working on feature branch, there are new commits on main
git pull origin main --rebase

# if there are conflicts, resolve them and then:
git add .
git rebase --continue

# force push to remote feature branch
git push -f
```

### Commits

- Commits should be atomic (guideline: the commit is self-contained; a reviewer could make sense of it even if they viewed the commit diff in isolation)
- Trivial commits (e.g. fixing a typo in the previous commit, formatting changes) should be squashed or fixup'd into the last non-trivial commit

```bash
# last commit contained a typo, fixed now
git add .
git commit -m "Fix typo"

# fixup into previous commit through interactive rebase
# x in HEAD~x refers to the last x commits you want to view
git rebase -i HEAD~2
# text editor opens, follow instructions in there to fixup

# force push to remote feature branch
git push -f
```

- Use ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) naming scheme for commits and PRs
- Commit messages and PR names are descriptive and written in **imperative tense**<sup>1</sup>
- E.g. "feat: create user REST endpoints" or "fix: set bgcolor to blue"
- PRs can contain multiple commits, they do not need to be squashed together before merging as long as each commit is atomic. Our repo is configured to only allow squash commits to `main` so the entire PR will appear as 1 commit on `main`, but the individual commits are preserved when viewing the PR.
