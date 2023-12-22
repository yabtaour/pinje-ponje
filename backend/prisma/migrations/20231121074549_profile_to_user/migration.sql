/*
  Warnings:

  - You are about to drop the column `experience` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `gamePoints` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `level` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `rank` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_username_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "experience",
DROP COLUMN "gamePoints",
DROP COLUMN "level",
DROP COLUMN "rank",
DROP COLUMN "username";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "gamePoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rank" "Rank" NOT NULL DEFAULT 'UNRANKED',
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
