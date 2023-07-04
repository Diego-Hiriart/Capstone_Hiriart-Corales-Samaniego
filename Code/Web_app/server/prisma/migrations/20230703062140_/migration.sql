-- DropForeignKey
ALTER TABLE "AITraining" DROP CONSTRAINT "AITraining_trainerID_fkey";

-- AlterTable
ALTER TABLE "AITraining" ALTER COLUMN "feedback" DROP NOT NULL,
ALTER COLUMN "trainerID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AITraining" ADD CONSTRAINT "AITraining_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE SET NULL ON UPDATE CASCADE;
