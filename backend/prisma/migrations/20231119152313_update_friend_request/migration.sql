/*
  Warnings:

  - You are about to drop the `_UserBlockeds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserPending` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocking" DROP CONSTRAINT "UserBlocking_blockedId_fkey";

-- DropForeignKey
ALTER TABLE "UserBlocking" DROP CONSTRAINT "UserBlocking_blockerId_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlockeds" DROP CONSTRAINT "_UserBlockeds_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlockeds" DROP CONSTRAINT "_UserBlockeds_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserPending" DROP CONSTRAINT "_UserPending_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserPending" DROP CONSTRAINT "_UserPending_B_fkey";

-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "_UserBlockeds";

-- DropTable
DROP TABLE "_UserPending";

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequest_id_key" ON "FriendRequest"("id");

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocking" ADD CONSTRAINT "UserBlocking_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlocking" ADD CONSTRAINT "UserBlocking_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
