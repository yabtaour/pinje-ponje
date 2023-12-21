/*
  Warnings:

  - Added the required column `state` to the `RoomMembership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MemberState" ADD VALUE 'BANNED';

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_roomId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMembership" DROP CONSTRAINT "RoomMembership_roomId_fkey";

-- AlterTable
ALTER TABLE "RoomMembership" ADD COLUMN     "state" "MemberState" NOT NULL;

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
