/*
  Warnings:

  - You are about to drop the column `trainingExerciseID` on the `Error` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Error" DROP CONSTRAINT "Error_trainingExerciseID_fkey";

-- AlterTable
ALTER TABLE "Error" DROP COLUMN "trainingExerciseID";
