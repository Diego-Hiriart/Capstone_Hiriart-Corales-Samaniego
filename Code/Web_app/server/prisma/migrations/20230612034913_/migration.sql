-- DropForeignKey
ALTER TABLE "DailyPlan" DROP CONSTRAINT "DailyPlan_activityTypeID_fkey";

-- AlterTable
ALTER TABLE "DailyPlan" ALTER COLUMN "activityTypeID" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyPlan" ADD CONSTRAINT "DailyPlan_activityTypeID_fkey" FOREIGN KEY ("activityTypeID") REFERENCES "ActivityType"("activityTypeID") ON DELETE SET NULL ON UPDATE CASCADE;
