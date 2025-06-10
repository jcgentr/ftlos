-- CreateEnum
CREATE TYPE "TagSentiment" AS ENUM ('LOVE', 'LOATHE');

-- CreateTable
CREATE TABLE "user_taglines" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "entityType" "EntityType" NOT NULL,
    "entityId" INTEGER NOT NULL,
    "sentiment" "TagSentiment" NOT NULL,
    "position" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_taglines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_taglines_user_id_idx" ON "user_taglines"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_taglines_user_id_position_key" ON "user_taglines"("user_id", "position");

-- CreateIndex
CREATE UNIQUE INDEX "user_taglines_user_id_entityType_entityId_key" ON "user_taglines"("user_id", "entityType", "entityId");

-- AddForeignKey
ALTER TABLE "user_taglines" ADD CONSTRAINT "user_taglines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
