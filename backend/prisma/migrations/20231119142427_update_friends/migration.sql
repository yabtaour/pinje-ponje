/*
  Warnings:

  - You are about to drop the `UserFriendship` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFriendship" DROP CONSTRAINT "UserFriendship_friendId_fkey";

-- DropTable
DROP TABLE "UserFriendship";

-- CreateTable
CREATE TABLE "Friendship" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendEntityId" INTEGER,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendEntity" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "FriendEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_id_key" ON "Friendship"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FriendEntity_id_key" ON "FriendEntity"("id");

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_friendEntityId_fkey" FOREIGN KEY ("friendEntityId") REFERENCES "FriendEntity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
