-- CreateEnum
CREATE TYPE "SweepstakeStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateTable
CREATE TABLE "sweepstakes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "prize_pool" DECIMAL(10,2) NOT NULL,
    "status" "SweepstakeStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sweepstakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "sweepstake_id" TEXT NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "team_one_id" INTEGER NOT NULL,
    "team_two_id" INTEGER NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "is_final" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sweepstake_entries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "sweepstake_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sweepstake_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_picks" (
    "id" TEXT NOT NULL,
    "sweepstake_entry_id" TEXT NOT NULL,
    "game_id" TEXT NOT NULL,
    "selected_team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "game_picks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "games_sweepstake_id_idx" ON "games"("sweepstake_id");

-- CreateIndex
CREATE INDEX "games_sport_id_idx" ON "games"("sport_id");

-- CreateIndex
CREATE INDEX "games_team_one_id_idx" ON "games"("team_one_id");

-- CreateIndex
CREATE INDEX "games_team_two_id_idx" ON "games"("team_two_id");

-- CreateIndex
CREATE INDEX "sweepstake_entries_user_id_idx" ON "sweepstake_entries"("user_id");

-- CreateIndex
CREATE INDEX "sweepstake_entries_sweepstake_id_idx" ON "sweepstake_entries"("sweepstake_id");

-- CreateIndex
CREATE UNIQUE INDEX "sweepstake_entries_user_id_sweepstake_id_key" ON "sweepstake_entries"("user_id", "sweepstake_id");

-- CreateIndex
CREATE INDEX "game_picks_sweepstake_entry_id_idx" ON "game_picks"("sweepstake_entry_id");

-- CreateIndex
CREATE INDEX "game_picks_game_id_idx" ON "game_picks"("game_id");

-- CreateIndex
CREATE INDEX "game_picks_selected_team_id_idx" ON "game_picks"("selected_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "game_picks_sweepstake_entry_id_game_id_key" ON "game_picks"("sweepstake_entry_id", "game_id");

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_sweepstake_id_fkey" FOREIGN KEY ("sweepstake_id") REFERENCES "sweepstakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_one_id_fkey" FOREIGN KEY ("team_one_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_team_two_id_fkey" FOREIGN KEY ("team_two_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweepstake_entries" ADD CONSTRAINT "sweepstake_entries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sweepstake_entries" ADD CONSTRAINT "sweepstake_entries_sweepstake_id_fkey" FOREIGN KEY ("sweepstake_id") REFERENCES "sweepstakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_picks" ADD CONSTRAINT "game_picks_sweepstake_entry_id_fkey" FOREIGN KEY ("sweepstake_entry_id") REFERENCES "sweepstake_entries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_picks" ADD CONSTRAINT "game_picks_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_picks" ADD CONSTRAINT "game_picks_selected_team_id_fkey" FOREIGN KEY ("selected_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
