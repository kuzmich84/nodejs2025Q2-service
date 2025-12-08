# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/kuzmich84/nodejs2025Q2-service.git
```

## Installing NPM modules

```
cd nodejs2025Q4-service
npm install
```

#### 2. Configure environment variables

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred values. **For Docker, use `postgres` as the database host:**

```env
# Database URL (use 'postgres' as host for Docker)
DATABASE_URL="postgresql://postgres:postgrespassword@postgres:5432/musicdb?schema=public"

POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgrespassword
POSTGRES_DB=musicdb
POSTGRES_PORT=5432
```

#### 3. Start the application

```bash
docker compose up
```

The application will be available at `http://localhost:4000`

#### 4. Basic Docker Commands

**Stop the application:**

```bash
docker compose down
```

**View logs:**

```bash
# All services
docker compose logs -f

# Application only
docker compose logs -f app

# Database only
docker compose logs -f postgres
```

**Rebuild containers after code changes:**

```bash
docker compose build
docker compose up
```

## Local Development

If you prefer to run the application without Docker, you have two options:

### Option 1: Local Application with Database in Docker

This approach runs the application locally, using Docker only for PostgreSQL.

**1. Clone the repository**

```bash
git clone https://github.com/kuzmich84/nodejs2025Q2-service.git
cd nodejs2025Q4-service
```

**2. Install dependencies**

```bash
npm install
```

**3. Start PostgreSQL in Docker**

```bash
docker compose up postgres -d
```

**4. Configure environment variables**

```bash
cp .env.example .env
```

Edit the `.env` file to use `localhost` as the database host:

```env
# Database URL (use 'localhost' for local development)
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/musicdb?schema=public"
```

**5. Run database migrations**

```bash
npx prisma migrate deploy
```

**6. Generate Prisma Client**

```bash
npx prisma generate
```

**7. Start the application**

**Development mode (with hot-reload):**

```bash
npm run start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

The application will be available at `http://localhost:4000`

**8. Stop the database when finished**

```bash
docker compose down
```

## Testing

Use Postman or a similar tool for testing.

At this stage, you can create users, tracks, albums, and artists, as well as read, edit, and delete information about them. You can also add and remove tracks, albums, and artists from favorites.

```bash
npm run test
```

## Vulnerability Scanning

```bash
npm run security
```

## Command Reference

### Docker Commands

```bash
# Start all services (production)
docker compose up

# Start all services (development with hot-reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all services
docker compose down

# Stop all services and delete data of volumes
docker compose down -v

# Start again
docker compose up -d

# Deploy migrate
docker compose exec api npx prisma migrate deploy

# Enter into conteiner
docker compose exec {NAME_SERVICE} sh

# Rebuild containers
docker compose build --no-cache

# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f app
docker compose logs -f postgres

# Start only database (for local development)
docker compose up postgres -d
```

### Local Development Commands

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Start development server (with hot-reload)
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Run tests
npm run test
npm run test:auth

# Run linting
npm run lint

# Run formatting
npm run format

# Run security audit
npm run audit
```

### Useful Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio

# Validate Prisma schema
npx prisma validate

# Format Prisma schema
npx prisma format
```

## Running application

```

npm start

```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/doc/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```

npm run test

```

To run only one of all test suites

```

npm run test -- <path to suite>

```

To run all test with authorization

```

npm run test:auth

```

To run only specific test suite with authorization

```

npm run test:auth -- <path to suite>

```

### Auto-fix and format

```

npm run lint

```

```

npm run format

```

### Debugging in VSCode

Press <kbd>F5</kbd> to debug.

For more information, visit: https://code.visualstudio.com/docs/editor/debugging

```

```
