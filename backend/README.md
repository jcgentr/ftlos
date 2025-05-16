# Prisma Database Commands

## Good to Know

Whenever you update your Prisma schema, you will have to update your database schema using either `prisma migrate dev` or `prisma db push`. This will keep your database schema in sync with your Prisma schema. These commands will also run `prisma generate` under the hood to re-generate your Prisma Client.

## `npx prisma migrate dev`

**Purpose:** This command generates and applies a new migration based on your Prisma schema changes. It creates migration files that keep a history of changes.

**Use Case:** Use this when you want to maintain a record of database changes, which is essential for production environments or when working in teams. It allows for version control of your database schema.

**Benefits:** This command also includes checks for applying migrations in a controlled manner, ensuring data integrity.

## `npx prisma db push`

**Purpose:** This command is used to push your current Prisma schema to the database directly. It applies any changes you've made to your schema without creating migration files.

**Use Case:** It's particularly useful during the development phase when you want to quickly sync your database schema with your Prisma schema without worrying about migration history.

**Caution:** It can overwrite data if your schema changes affect existing tables or columns, so it's best for early-stage development or prototyping.
