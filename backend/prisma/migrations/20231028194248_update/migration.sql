-- DropIndex
DROP INDEX "User_intraid_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "bio" VARCHAR(255) DEFAULT 'I am a new player';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT;
