/*
  Warnings:

  - You are about to drop the column `Friends` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the `_UserBlocked` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserBlocked" DROP CONSTRAINT "_UserBlocked_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBlocked" DROP CONSTRAINT "_UserBlocked_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserPending" DROP CONSTRAINT "_UserPending_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserPending" DROP CONSTRAINT "_UserPending_B_fkey";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "Friends";

-- DropTable
DROP TABLE "_UserBlocked";

-- AddForeignKey
ALTER TABLE "_UserPending" ADD CONSTRAINT "_UserPending_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPending" ADD CONSTRAINT "_UserPending_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
