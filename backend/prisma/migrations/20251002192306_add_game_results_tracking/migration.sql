-- AlterTable
ALTER TABLE "games" ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "winner_player_id" INTEGER,
ADD COLUMN     "winner_team_id" INTEGER;

-- CreateIndex
CREATE INDEX "games_winner_team_id_idx" ON "games"("winner_team_id");

-- CreateIndex
CREATE INDEX "games_winner_player_id_idx" ON "games"("winner_player_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_winner_player_id_fkey" FOREIGN KEY ("winner_player_id") REFERENCES "athletes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
