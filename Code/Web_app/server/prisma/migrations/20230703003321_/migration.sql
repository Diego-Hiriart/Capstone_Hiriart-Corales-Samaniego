/*
  Warnings:

  - Added the required column `trainingExerciseID` to the `AITraining` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AITraining" ADD COLUMN     "trainingExerciseID" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "AITraining" ADD CONSTRAINT "AITraining_trainingExerciseID_fkey" FOREIGN KEY ("trainingExerciseID") REFERENCES "TrainingExercise"("trainingExerciseID") ON DELETE RESTRICT ON UPDATE CASCADE;
