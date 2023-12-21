/*
  Warnings:

  - The values [PLATINUM,DIAMOND,MASTER,GRANDMASTER,CHALLENGER] on the enum `Rank` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Rank_new" AS ENUM ('UNRANKED', 'IRON', 'BRONZE', 'SILVER', 'GOLD');
ALTER TABLE "User" ALTER COLUMN "rank" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "rank" TYPE "Rank_new" USING ("rank"::text::"Rank_new");
ALTER TYPE "Rank" RENAME TO "Rank_old";
ALTER TYPE "Rank_new" RENAME TO "Rank";
DROP TYPE "Rank_old";
ALTER TABLE "User" ALTER COLUMN "rank" SET DEFAULT 'UNRANKED';
COMMIT;
