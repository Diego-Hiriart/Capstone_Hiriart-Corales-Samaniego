/*
  Warnings:

  - The primary key for the `AITraining` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AITraining` on the `AITraining` table. All the data in the column will be lost.
  - Changed the type of `duration` on the `AITraining` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "TrainingError" DROP CONSTRAINT "TrainingError_AITrainingID_fkey";

-- AlterTable
ALTER TABLE "AITraining" DROP CONSTRAINT "AITraining_pkey",
DROP COLUMN "AITraining",
ADD COLUMN     "AITrainingID" SERIAL NOT NULL,
DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD CONSTRAINT "AITraining_pkey" PRIMARY KEY ("AITrainingID");

-- AddForeignKey
ALTER TABLE "TrainingError" ADD CONSTRAINT "TrainingError_AITrainingID_fkey" FOREIGN KEY ("AITrainingID") REFERENCES "AITraining"("AITrainingID") ON DELETE RESTRICT ON UPDATE CASCADE;
