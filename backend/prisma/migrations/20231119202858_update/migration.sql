/*
  Warnings:

  - You are about to drop the `Friendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_friendId_fkey";

-- DropForeignKey
ALTER TABLE "Friendship" DROP CONSTRAINT "Friendship_userId_fkey";

-- DropTable
DROP TABLE "Friendship";

-- CreateTable
CREATE TABLE "FriendshipTest" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,

    CONSTRAINT "FriendshipTest_pkey" PRIMARY KEY ("userId","friendId")
);

-- AddForeignKey
ALTER TABLE "FriendshipTest" ADD CONSTRAINT "FriendshipTest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendshipTest" ADD CONSTRAINT "FriendshipTest_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
