/*
  Warnings:

  - Added the required column `leftPriority` to the `TrainingCombat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rightPriority` to the `TrainingCombat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrainingCombat" ADD COLUMN     "leftPriority" BOOLEAN NOT NULL,
ADD COLUMN     "rightPriority" BOOLEAN NOT NULL;
