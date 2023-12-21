-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "RoomMembership" DROP CONSTRAINT "RoomMembership_userId_fkey";

-- AddForeignKey
ALTER TABLE "RoomMembership" ADD CONSTRAINT "RoomMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
