/*
  Warnings:

  - Added the required column `trainingExerciseID` to the `Error` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Error" ADD COLUMN     "trainingExerciseID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TrainingExercise" (
    "trainingExerciseID" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "TrainingExercise_pkey" PRIMARY KEY ("trainingExerciseID")
);

-- AddForeignKey
ALTER TABLE "Error" ADD CONSTRAINT "Error_trainingExerciseID_fkey" FOREIGN KEY ("trainingExerciseID") REFERENCES "TrainingExercise"("trainingExerciseID") ON DELETE RESTRICT ON UPDATE CASCADE;
