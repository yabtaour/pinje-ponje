/*
  Warnings:

  - You are about to drop the column `playerid` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `winnerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `Score` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED', 'GAME_INVITE', 'GAME_INVITE_REJECTED', 'GROUPE_CHAT_INVITE');

-- CreateEnum
CREATE TYPE "playerStatus" AS ENUM ('WINNER', 'LOSER');

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'INQUEUE';

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_playerid_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_gameid_fkey";

-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_playerid_fkey";

-- DropIndex
DROP INDEX "Game_playerid_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerid",
DROP COLUMN "winnerId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "consitency" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "reflex" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "winRate" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Score";

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "playerStatus" NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "gameId" INTEGER NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consitency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reflex" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "senderid" INTEGER NOT NULL,
    "receiverid" INTEGER NOT NULL,
    "type" "NotificationType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_id_key" ON "Player"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_gameId_key" ON "Player"("userId", "gameId");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_senderid_fkey" FOREIGN KEY ("senderid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_receiverid_fkey" FOREIGN KEY ("receiverid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
