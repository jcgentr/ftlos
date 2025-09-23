-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TagSentiment" ADD VALUE 'LOVES';
ALTER TYPE "TagSentiment" ADD VALUE 'LOOKS_LIKE';
ALTER TYPE "TagSentiment" ADD VALUE 'WATCHES';
ALTER TYPE "TagSentiment" ADD VALUE 'IDOLIZES';
ALTER TYPE "TagSentiment" ADD VALUE 'ADORES';
ALTER TYPE "TagSentiment" ADD VALUE 'SUPPORTS';
ALTER TYPE "TagSentiment" ADD VALUE 'DETESTS';
ALTER TYPE "TagSentiment" ADD VALUE 'LOATHES';
ALTER TYPE "TagSentiment" ADD VALUE 'ROOTS_AGAINST';
ALTER TYPE "TagSentiment" ADD VALUE 'LAUGHS_AT';
ALTER TYPE "TagSentiment" ADD VALUE 'PITIES';
ALTER TYPE "TagSentiment" ADD VALUE 'IS_SCARED_OF';
