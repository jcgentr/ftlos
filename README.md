# FTLOS - For the Love of Sports

FTLOS is a full-stack web application for sports fans to connect, rate teams and athletes, create and participate in sweepstakes, and build a community around their favorite sports.

![FTLOS Logo](frontend/public/logo.png)

## Technologies Used

### Frontend

- **React 19** with TypeScript
- **Vite** as the build tool and development server
- **React Router** for client-side routing
- **Tailwind CSS** for styling
- **shadcn/ui** for accessible UI components
- **Supabase** for authentication and image storage
- **Context API** for state management

### Backend

- **Node.js** with **Express** for the API server
- **TypeScript** for type safety
- **Prisma** as the ORM
- **PostgreSQL** as the database
- **JWT** for authentication
- **Resend** for email functionality

### Infrastructure

- **Docker** for containerization
- **PM2** for process management in production
- **NGINX** as a reverse proxy in production

## Features

- User authentication and profile management
- Sports, teams, and athletes data management
- User ratings and rankings for sports entities
- Friend system (send/accept friend requests)
- Sweepstakes and competitions
- User taglines
- Admin dashboard

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (v8 or higher)
- Docker and Docker Compose (for running PostgreSQL)

### Local Development Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ftlos.git
cd ftlos
```

2. **Set up the PostgreSQL database**

Create a `docker-compose.yml` file based on the example:

```bash
cp docker-compose.example.yml docker-compose.yml
```

Edit the file to set your PostgreSQL credentials, then start the database:

```bash
docker-compose up -d
```

3. **Backend setup**

```bash
cd backend

# Create .env file with your database connection and other settings
cp .env.example .env

# Update the .env file with your PostgreSQL credentials and other settings
# DATABASE_URL format: postgresql://username:password@localhost:5432/database

# Install dependencies
pnpm install

# Run database migrations
npx prisma migrate dev

# Seed the database (optional)
npx prisma db seed

# Start the development server
pnpm run dev
```

4. **Frontend setup**

```bash
cd frontend

# Create .env file
cp .env.example .env

# Update the .env file with your backend API URL
# VITE_API_URL=http://localhost:3001/api

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

5. **Access the application**

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3001/api](http://localhost:3001/api)
- Prisma Studio (database management): Run `npx prisma studio` in the backend directory and access at [http://localhost:5555](http://localhost:5555)

## Project Structure

- `/frontend` - React frontend application
- `/backend` - Express backend API server
- `/backend/prisma` - Database schema and migrations
- `/shared` - Shared TypeScript types and utilities
- `/data` - CSV data files for database seeding

## Available Scripts

### Frontend

- `pnpm run dev` - Start the development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview the production build
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues
- `pnpm run format` - Format code with Prettier

### Backend

- `pnpm run dev` - Start the development server with hot-reload
- `pnpm run build` - Build for production
- `pnpm run start` - Start the production server
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint issues
- `pnpm run format` - Format code with Prettier

## Database Exports

To export database tables to CSV files:

```bash
# Run the export commands from DATABASE.md
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY athletes TO '/tmp/athletes.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY teams TO '/tmp/teams.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY sports TO '/tmp/sports.csv' WITH (FORMAT CSV, HEADER);"
docker exec -it ftlos-postgres-1 psql -U ftlosuser -d ftlos -c "\COPY users TO '/tmp/users.csv' WITH (FORMAT CSV, HEADER);"

# Copy the CSV files to the data directory
docker cp ftlos-postgres-1:/tmp/athletes.csv ./data/athletes.csv
docker cp ftlos-postgres-1:/tmp/teams.csv ./data/teams.csv
docker cp ftlos-postgres-1:/tmp/sports.csv ./data/sports.csv
docker cp ftlos-postgres-1:/tmp/users.csv ./data/users.csv
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.
