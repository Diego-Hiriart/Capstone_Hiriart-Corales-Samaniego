-- DropForeignKey
ALTER TABLE "RegistrationLink" DROP CONSTRAINT "RegistrationLink_fencerID_fkey";

-- AlterTable
ALTER TABLE "RegistrationLink" ALTER COLUMN "fencerID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RegistrationLink" ADD CONSTRAINT "RegistrationLink_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE SET NULL ON UPDATE CASCADE;
