# Marillac Place

## Table of Contents
⚙️  [Tech Stack](#tech-stack)  
🚀  [Development Setup](#development-setup)  
▶️  [Application Execution](#application-execution)  
📊  [Database Interactions](#database-interactions)  
🐞  [FAQ & Debugging](#faq--debugging)  
✨  [Linting](#linting)  
🌐  [Other Links](#other-links)  

## Tech Stack
**Frontend:** React, Chakra UI, Material UI  
**Backend:** TypeScript, GraphQL, Express.js on Node.js  
**Database:** PostgreSQL  

## Development Setup
1. Download & open [Docker Desktop](https://docs.docker.com/get-started/get-docker/)
2. Clone this repository
```bash
git clone https://github.com/uwblueprint/marillac-place.git
cd marillac-place
```
3. Install [NVM](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) and run the following commands:
```bash
nvm install 18.18.2
nvm use 18.18.2
```
4. Optional, you might recieve a few errors about missing packages on your local computer. To resolve them, run *yarn install* in both the frontend and backend folders
5. Populate .env files in the root, frontend and backend folders
6. Apply prisma schema onto database following [these instructions](#database-interactions)

## Application Execution
```bash
docker-compose up --build
```
Frontend: http://localhost:3000  
Backend: http://localhost:5000/graphql

## Database Interactions
Apply / migrate changes in prisma.schema to the database:
1. Change the DATABASE_URL in the backend .env file to: postgresql://postgres:postgres@**localhost**:5432/mp
2. In your terminal, run `npx prisma migrate dev` in the backend folder and follow the prompts
3. Don’t forget to reset DATABASE_URL back to postgresql://postgres:postgres@**mp_db**:5432/mp

Common database commands:
```bash
# access your database container (ensure it is running)
docker exec -it mp_db /bin/bash

# enter the postgres shell 
psql -U postgres -d mp

# run any psql queries and commands
SELECT * FROM participant;
DELETE FROM task WHERE task_id = 1;
\dt
\q
```

## FAQ & Debugging  
<details>
<summary>How do I test my GraphQL endpoint?</summary>
  
- Ensure your backend container is running without error 
- Go to http://localhost:5000/graphql and you should see a UI for testing 
- In the bottom panel, select “HTTP HEADERS” and paste the following testing token: 
```bash
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDc3MTc5NDF9.8Z7MEw0o7fgIpFTnw82kv0yTW8tG2i7TrcuXPY-i0l4"
}
```  
- Run your query/mutation in the left panel and view the output on the right
</details>

<details>
<summary>What are the test credentials to login as admin?</summary>
  
- Administrative Staff Password: abc123  
- Relief Staff Password: test123
</details>

<details>
<summary>"ENOSPC: no space left on device” when trying to re-build docker container</summary>
  
Run the following in your terminal:
```bash
docker system prune -a
docker-compose up --build
```
</details>

<details>
<summary>error ESOCKETTIMEOUT: "There appears to be a trouble with your network connection. Retrying…"</summary>
  
Sometimes Material UI takes a long time to install initially so we'll want to increase the timeout limit:
```bash
# in each docker file replace any "yarn install" line with:
RUN yarn config set network-timeout 600000 && yarn install
```
</details>

## Linting
```bash
# linting with warnings only
docker exec -it mp_[frontend/backend] /bin/bash -c "yarn lint"

# linting with automatic fixes
docker exec -it mp_[frontend/backend] /bin/bash -c "yarn fix"
```

## Other Links
📝  [Notion](https://www.notion.so/uwblueprintexecs/Marillac-Place-4c0b622383244a8a8a51f2487ca080c6?source=copy_link)  
🎨  [Figma](https://www.figma.com/design/Ts9QxCIXFe4l9h6GKOLOIq/Admin-Application?node-id=5320-29338&p=f&t=bZ4sCMzgpiYIHwiP-0)  
