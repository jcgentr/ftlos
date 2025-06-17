/*
  Warnings:

  - Added the required column `created_by_id` to the `sweepstakes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sweepstakes" ADD COLUMN     "created_by_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "sweepstakes_created_by_id_idx" ON "sweepstakes"("created_by_id");

-- AddForeignKey
ALTER TABLE "sweepstakes" ADD CONSTRAINT "sweepstakes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
