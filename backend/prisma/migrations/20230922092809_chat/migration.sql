/*
  Warnings:

  - You are about to drop the column `avatar` on the `ChatRoom` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ChatRoom` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `ChatRoom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `roomType` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `ChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE', 'DM');

-- CreateEnum
CREATE TYPE "GameResult" AS ENUM ('WIN', 'LOSE', 'DRAW');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- DropIndex
DROP INDEX "ChatRoom_id_key";

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "avatar",
DROP COLUMN "type",
ADD COLUMN     "password" TEXT,
ADD COLUMN     "roomType" "RoomType" NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- DropEnum
DROP TYPE "gameResult";

-- DropEnum
DROP TYPE "gameStatus";

-- DropEnum
DROP TYPE "roomType";

-- CreateTable
CREATE TABLE "RoomMembership" (
    "id" SERIAL NOT NULL,
    "role" "ChatRole" NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "RoomMembership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "roomId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
