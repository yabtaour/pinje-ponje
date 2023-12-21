-- CreateTable
CREATE TABLE "_UserBlockeds" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserBlockeds_AB_unique" ON "_UserBlockeds"("A", "B");

-- CreateIndex
CREATE INDEX "_UserBlockeds_B_index" ON "_UserBlockeds"("B");

-- AddForeignKey
ALTER TABLE "_UserBlockeds" ADD CONSTRAINT "_UserBlockeds_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserBlockeds" ADD CONSTRAINT "_UserBlockeds_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
