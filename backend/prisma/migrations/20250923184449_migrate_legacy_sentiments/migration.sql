-- Create a new enum type without the deprecated values
CREATE TYPE "TagSentiment_new" AS ENUM (
  'LOVES', 'LOOKS_LIKE', 'WATCHES', 'IDOLIZES', 'ADORES', 'SUPPORTS',
  'DETESTS', 'LOATHES', 'ROOTS_AGAINST', 'LAUGHS_AT', 'PITIES', 'IS_SCARED_OF'
);

-- First convert all existing values using a CASE statement with text conversion
ALTER TABLE "user_taglines" 
  ADD COLUMN "sentiment_new" "TagSentiment_new";

-- Set new values based on old values
UPDATE "user_taglines"
SET "sentiment_new" = CASE 
  WHEN "sentiment"::text = 'LOVE' THEN 'LOVES'::"TagSentiment_new"
  WHEN "sentiment"::text = 'LOATHE' THEN 'LOATHES'::"TagSentiment_new"
  ELSE "sentiment"::text::"TagSentiment_new"
END;

-- Drop old column, rename new column
ALTER TABLE "user_taglines" DROP COLUMN "sentiment";
ALTER TABLE "user_taglines" RENAME COLUMN "sentiment_new" TO "sentiment";

-- Drop the old enum
DROP TYPE "TagSentiment";

-- Rename the new enum to the original name
ALTER TYPE "TagSentiment_new" RENAME TO "TagSentiment";