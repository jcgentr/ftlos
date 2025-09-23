/*
  Warnings:

  - Made the column `sentiment` on table `user_taglines` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_taglines" ALTER COLUMN "sentiment" SET NOT NULL;
