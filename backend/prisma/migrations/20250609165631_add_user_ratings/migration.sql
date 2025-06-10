-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('ATHLETE', 'TEAM', 'SPORT');

-- CreateTable
CREATE TABLE "user_ratings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_ratings_user_id_idx" ON "user_ratings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_ratings_user_id_entityType_entityId_key" ON "user_ratings"("user_id", "entityType", "entityId");

-- AddForeignKey
ALTER TABLE "user_ratings" ADD CONSTRAINT "user_ratings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
