/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Fencer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userID]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Administrator_userID_key" ON "Administrator"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Fencer_userID_key" ON "Fencer"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Trainer_userID_key" ON "Trainer"("userID");
