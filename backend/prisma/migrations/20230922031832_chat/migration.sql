-- CreateEnum
CREATE TYPE "roomType" AS ENUM ('PUBLIC', 'PROTECTED', 'PRIVATE', 'DM');

-- CreateEnum
CREATE TYPE "MemberState" AS ENUM ('ACTIVE', 'MUTED');

-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('MEMBER', 'ADMIN', 'OWNER');

-- CreateEnum
CREATE TYPE "gameResult" AS ENUM ('WIN', 'LOSE', 'DRAW');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INGAME', 'ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "gameStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('UNRANKED', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "Hashpassword" TEXT,
    "email" TEXT NOT NULL,
    "intraid" INTEGER,
    "twofactor" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "avatar" TEXT,
    "Rank" "Rank" NOT NULL DEFAULT 'UNRANKED',
    "level" INTEGER NOT NULL DEFAULT 0,
    "Friends" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "type" "roomType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserBlocked" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserPending" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_intraid_key" ON "User"("intraid");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_login_key" ON "Profile"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userid_key" ON "Profile"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_id_key" ON "ChatRoom"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_UserBlocked_AB_unique" ON "_UserBlocked"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBlocked_B_index" ON "_UserBlocked"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UserPending_AB_unique" ON "_UserPending"("A", "B");

-- CreateIndex
CREATE INDEX "_UserPending_B_index" ON "_UserPending"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlocked" ADD CONSTRAINT "_UserBlocked_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPending" ADD CONSTRAINT "_UserPending_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPending" ADD CONSTRAINT "_UserPending_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
