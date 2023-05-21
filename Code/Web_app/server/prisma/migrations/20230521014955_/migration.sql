/*
  Warnings:

  - You are about to drop the column `fencerID` on the `RegistrationLink` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "RegistrationLink" DROP CONSTRAINT "RegistrationLink_fencerID_fkey";

-- AlterTable
ALTER TABLE "RegistrationLink" DROP COLUMN "fencerID";
