/*
  Warnings:

  - You are about to drop the column `leftPriority` on the `TrainingCombat` table. All the data in the column will be lost.
  - You are about to drop the column `rightPriority` on the `TrainingCombat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TrainingCombat" DROP COLUMN "leftPriority",
DROP COLUMN "rightPriority";
