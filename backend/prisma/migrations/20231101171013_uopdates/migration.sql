/*
  Warnings:

  - You are about to drop the column `Rank` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `Hashpassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twofactor` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('VSONE', 'VSBOT', 'VSALL');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'SPECTATING';

-- DropIndex
DROP INDEX "Profile_login_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "Rank",
DROP COLUMN "login",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" "Rank" NOT NULL DEFAULT 'UNRANKED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Hashpassword",
DROP COLUMN "twofactor",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "twoFactor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Score" (
    "id" SERIAL NOT NULL,
    "playerid" INTEGER NOT NULL,
    "gameid" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "result" "GameResult" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerid" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "mode" "GameMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Score_playerid_key" ON "Score"("playerid");

-- CreateIndex
CREATE UNIQUE INDEX "Score_gameid_key" ON "Score"("gameid");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_playerid_key" ON "Game"("playerid");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_gameid_fkey" FOREIGN KEY ("gameid") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_playerid_fkey" FOREIGN KEY ("playerid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
