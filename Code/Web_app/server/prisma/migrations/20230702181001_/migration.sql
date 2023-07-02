-- DropForeignKey
ALTER TABLE "Activity" DROP CONSTRAINT "Activity_activityTypeID_fkey";

-- AlterTable
ALTER TABLE "Activity" ALTER COLUMN "activityTypeID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_activityTypeID_fkey" FOREIGN KEY ("activityTypeID") REFERENCES "ActivityType"("activityTypeID") ON DELETE SET NULL ON UPDATE CASCADE;
