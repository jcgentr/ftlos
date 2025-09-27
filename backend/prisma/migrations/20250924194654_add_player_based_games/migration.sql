-- DropForeignKey
ALTER TABLE "game_picks" DROP CONSTRAINT "game_picks_selected_team_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_team_one_id_fkey";

-- DropForeignKey
ALTER TABLE "games" DROP CONSTRAINT "games_team_two_id_fkey";

-- AlterTable
ALTER TABLE "game_picks" ADD COLUMN     "selected_athlete_id" INTEGER,
ALTER COLUMN "selected_team_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "games" ADD COLUMN     "player_one_id" INTEGER,
ADD COLUMN     "player_two_id" INTEGER,
ALTER COLUMN "team_one_id" DROP NOT NULL,
ALTER COLUMN "team_two_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "game_picks_selected_athlete_id_idx" ON "game_picks"("selected_athlete_id");

-- CreateIndex
CREATE INDEX "games_player_one_id_idx" ON "games"("player_one_id");

-- CreateIndex
CREATE INDEX "games_player_two_id_idx" ON "games"("player_two_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_one_id_fkey" FOREIGN KEY ("team_one_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_two_id_fkey" FOREIGN KEY ("team_two_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_one_id_fkey" FOREIGN KEY ("player_one_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player_two_id_fkey" FOREIGN KEY ("player_two_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_picks" ADD CONSTRAINT "game_picks_selected_team_id_fkey" FOREIGN KEY ("selected_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_picks" ADD CONSTRAINT "game_picks_selected_athlete_id_fkey" FOREIGN KEY ("selected_athlete_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
