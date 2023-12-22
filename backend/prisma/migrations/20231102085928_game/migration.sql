/*
  Warnings:

  - You are about to drop the column `Rank` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `login` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `Hashpassword` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twofactor` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "GameMode" AS ENUM ('VSONE', 'VSBOT', 'VSALL');

-- CreateEnum
CREATE TYPE "playerStatus" AS ENUM ('WINNER', 'LOSER');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Status" ADD VALUE 'INQUEUE';
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
ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "consitency" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "reflex" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ONLINE',
ADD COLUMN     "twoFactor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "playerStatus" NOT NULL,
    "gameId" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consitency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reflex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "mode" "GameMode" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_id_key" ON "Player"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
