/*
  Warnings:

  - You are about to drop the column `token` on the `RoomMembership` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dm_token]` on the table `RoomMembership` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "RoomMembership_token_key";

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "dm_token" TEXT;

-- AlterTable
ALTER TABLE "RoomMembership" DROP COLUMN "token",
ADD COLUMN     "dm_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "RoomMembership_dm_token_key" ON "RoomMembership"("dm_token");
