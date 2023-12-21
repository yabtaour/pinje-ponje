/*
  Warnings:

  - A unique constraint covering the columns `[userId,roomId]` on the table `RoomMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RoomMembership" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gameInvitesSent" INTEGER DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "RoomMembership_userId_roomId_key" ON "RoomMembership"("userId", "roomId");
