-- CreateTable
CREATE TABLE "sports" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "athletes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sport_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "athletes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sports_name_key" ON "sports"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sports_slug_key" ON "sports"("slug");

-- CreateIndex
CREATE INDEX "teams_sport_id_idx" ON "teams"("sport_id");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_sport_id_key" ON "teams"("name", "sport_id");

-- CreateIndex
CREATE INDEX "athletes_sport_id_idx" ON "athletes"("sport_id");

-- CreateIndex
CREATE INDEX "athletes_team_id_idx" ON "athletes"("team_id");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_sport_id_fkey" FOREIGN KEY ("sport_id") REFERENCES "sports"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "athletes" ADD CONSTRAINT "athletes_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
