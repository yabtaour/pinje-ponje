-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('SENT', 'FAIL', 'TEXT', 'INFORMATION');

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "state" "MessageType" NOT NULL DEFAULT 'SENT';
