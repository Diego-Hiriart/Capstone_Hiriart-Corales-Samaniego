/*
  Warnings:

  - You are about to drop the column `guestName` on the `Trainer` table. All the data in the column will be lost.
  - Made the column `userID` on table `Trainer` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Fencer" DROP CONSTRAINT "Fencer_userID_fkey";

-- DropForeignKey
ALTER TABLE "Trainer" DROP CONSTRAINT "Trainer_userID_fkey";

-- AlterTable
ALTER TABLE "Fencer" ADD COLUMN     "guestName" VARCHAR(200),
ALTER COLUMN "userID" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" DROP COLUMN "guestName",
ALTER COLUMN "userID" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fencer" ADD CONSTRAINT "Fencer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
