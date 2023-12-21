/*
  Warnings:

  - You are about to drop the column `Friends` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `FriendshipTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FriendshipTest" DROP CONSTRAINT "FriendshipTest_friendId_fkey";

-- DropForeignKey
ALTER TABLE "FriendshipTest" DROP CONSTRAINT "FriendshipTest_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Friends";

-- DropTable
DROP TABLE "FriendshipTest";

-- CreateTable
CREATE TABLE "Friendship" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("userId","friendId")
);

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
