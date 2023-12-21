/*
  Warnings:

  - The `state` column on the `ChatMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "MessageState" AS ENUM ('SENT', 'LOADING', 'FAIL', 'INFORMATION');

-- AlterTable
ALTER TABLE "ChatMessage" DROP COLUMN "state",
ADD COLUMN     "state" "MessageState" NOT NULL DEFAULT 'SENT';

-- DropEnum
DROP TYPE "MessageType";
