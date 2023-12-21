-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMembership" DROP CONSTRAINT "RoomMembership_userId_fkey";

-- AlterTable
ALTER TABLE "RoomMembership" ALTER COLUMN "state" SET DEFAULT 'ACTIVE';

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
