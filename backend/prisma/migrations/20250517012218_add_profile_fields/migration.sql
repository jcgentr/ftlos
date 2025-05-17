-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "favoriteSports" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "isConnecting" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "location" TEXT;
