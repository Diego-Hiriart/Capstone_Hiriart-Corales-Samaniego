/*
  Warnings:

  - You are about to drop the column `attended` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `status` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Trainer" DROP CONSTRAINT "Trainer_userID_fkey";

-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "attended",
ADD COLUMN     "status" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "Trainer" ADD COLUMN     "guestName" VARCHAR(200),
ALTER COLUMN "userID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE SET NULL ON UPDATE CASCADE;
