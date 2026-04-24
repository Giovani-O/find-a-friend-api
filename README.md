# Find a Friend API

A RESTful API for an animal shelter management system that connects organizations with potential pet adopters. Built with Fastify, Prisma, and TypeScript.

## Tech Stack

- **Runtime:** Node.js with TypeScript (ESM)
- **Framework:** Fastify 5
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens) via `@fastify/jwt`
- **Validation:** Zod
- **Testing:** Vitest (unit & E2E tests)
- **Build Tool:** tsup
- **Dev Server:** tsx

## Features

- **Organization Management:**
  - Create organization accounts
  - Authenticate organizations (login/logout)
  - JWT-based authentication with refresh tokens
  - Find organizations by email or ID
  - Fetch organizations by city

- **Pet Management:**
  - Register pets for adoption
  - Search pets by city
  - Get pet details by ID
  - Support for multiple species (Cat, Dog, Bird, Rodent, Other)
  - Size categorization (Micro, Small, Medium, Large)

## Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or pnpm

### Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd find-a-friend-api
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Variables**

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:
- `NODE_ENV` - Environment ("dev" | "production" | "test")
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation

4. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Running the Application

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3333` with hot-reload enabled.

### Production Build

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run all tests |
| `npm run test:unit` | Run unit tests only |
| `npm run test:e2e` | Run E2E tests only |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Open Vitest UI |
| `npm run db:studio` | Open Prisma Studio database GUI |

## API Endpoints

### Authentication & Organizations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/orgs` | Create new organization | No |
| POST | `/sessions` | Authenticate organization | No |
| PATCH | `/token/refresh` | Refresh JWT token | No |
| GET | `/orgs/me` | Get current organization | Yes |
| POST | `/orgs/find-by-email` | Find organization by email | No |
| POST | `/orgs/fetch-by-city` | Fetch organizations by city | No |

### Pets

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/pets` | Register a new pet | Yes |
| GET | `/pets/:id` | Get pet by ID | No |
| POST | `/pets/fetch-by-city` | Search pets by city | No |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |

## Project Structure

```
src/
├── @types/              # TypeScript type declarations
├── http/
│   ├── controllers/     # Route handlers (org, pet, health)
│   └── middlewares/     # Custom middlewares (verify-jwt)
├── repositories/        # Repository pattern interfaces
│   ├── in-memory/       # In-memory implementations for testing
│   └── prisma/          # Prisma-based implementations
├── use-case/            # Business logic layer
│   ├── @factories/      # Dependency injection factories
│   ├── @errors/         # Custom error classes
│   ├── org/             # Organization use cases
│   └── pet/             # Pet use cases
├── tests/
│   ├── unit/            # Unit tests
│   └── e2e/             # End-to-end tests
├── lib/                 # Shared utilities (prisma client)
├── app.ts               # Application setup
└── server.ts            # Entry point
```

## Testing

The project uses Vitest with separate configurations for unit and E2E tests:

```bash
# Run all tests
npm run test

# Run with UI
npm run test:ui

# Run in watch mode
npm run test:watch
```

## Database Models

### Org (Organization)
- id, name, email, whatsapp, password_hash, address, city, state, created_at

### Pet
- id, name, species, race, color, size, age, description, created_at, updated_at, org_id

## License

ISC
