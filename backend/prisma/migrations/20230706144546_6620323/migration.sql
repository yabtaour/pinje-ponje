-- CreateEnum
CREATE TYPE "gameResult" AS ENUM ('WIN', 'LOSE', 'DRAW');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('INGAME', 'ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "gameStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "Rank" AS ENUM ('BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "intraid" INTEGER NOT NULL,
    "Hashpassword" TEXT NOT NULL,
    "email" TEXT NOT NULL,
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
    "phonenumber" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ONLINE',
    "CurrentMap" TEXT NOT NULL,
    "UnlockedMap" TEXT[],
    "GamesLose" INTEGER,
    "GameDraw" INTEGER,
    "GamePlayed" INTEGER,
    "Rank" TEXT,
    "level" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "player1id" INTEGER NOT NULL,
    "player2id" INTEGER NOT NULL,
    "p1Score" INTEGER NOT NULL DEFAULT 0,
    "p2Score" INTEGER NOT NULL DEFAULT 0,
    "p1Result" "gameResult" NOT NULL DEFAULT 'DRAW',
    "p2Result" "gameResult" NOT NULL DEFAULT 'DRAW',
    "status" "gameStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_intraid_key" ON "User"("intraid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_id_key" ON "Profile"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_username_key" ON "Profile"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_login_key" ON "Profile"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userid_key" ON "Profile"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "Game_id_key" ON "Game"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player1id_key" ON "Game"("player1id");

-- CreateIndex
CREATE UNIQUE INDEX "Game_player2id_key" ON "Game"("player2id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_id_fkey" FOREIGN KEY ("id") REFERENCES "Profile"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player1id_fkey" FOREIGN KEY ("player1id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_player2id_fkey" FOREIGN KEY ("player2id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
