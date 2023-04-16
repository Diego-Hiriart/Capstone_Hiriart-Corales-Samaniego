/*
  Warnings:

  - You are about to alter the column `email` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(320)`.
  - You are about to alter the column `lastNames` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `names` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" TEXT[],
ALTER COLUMN "email" SET DATA TYPE VARCHAR(320),
ALTER COLUMN "lastNames" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "names" SET DATA TYPE VARCHAR(100);

-- CreateTable
CREATE TABLE "Trainer" (
    "trainerID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "experience" TEXT NOT NULL,
    "weapon" VARCHAR(25) NOT NULL,
    "pictureURL" VARCHAR(255),

    CONSTRAINT "Trainer_pkey" PRIMARY KEY ("trainerID")
);

-- CreateTable
CREATE TABLE "Fencer" (
    "fencerID" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "trainingGroupID" INTEGER NOT NULL,
    "idNumber" VARCHAR(15) NOT NULL,
    "emergencyPhone" VARCHAR(15) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "bloodType" VARCHAR(3) NOT NULL,
    "sex" CHAR(1) NOT NULL,
    "laterality" CHAR(1) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "insurance" VARCHAR(250) NOT NULL,
    "inscriptionDate" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "occupation" VARCHAR(50) NOT NULL,
    "schedule" VARCHAR(40) NOT NULL,
    "legalGuardian" VARCHAR(50) NOT NULL,
    "leadSource" TEXT NOT NULL,
    "inscriptionReason" TEXT NOT NULL,
    "height" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "physicalActivity" VARCHAR(250) NOT NULL,
    "medicalFamily" TEXT NOT NULL,
    "medicalPersonal" TEXT NOT NULL,
    "personalMedicalDetails" TEXT NOT NULL,
    "weapon" VARCHAR(25) NOT NULL,
    "pictureURL" VARCHAR(255) NOT NULL,

    CONSTRAINT "Fencer_pkey" PRIMARY KEY ("fencerID")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "weeklyReportID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("weeklyReportID")
);

-- CreateTable
CREATE TABLE "SingleFeedback" (
    "singleFeedbackID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "SingleFeedback_pkey" PRIMARY KEY ("singleFeedbackID")
);

-- CreateTable
CREATE TABLE "TrainingGroup" (
    "trainingGroupID" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "weapon" VARCHAR(25) NOT NULL,

    CONSTRAINT "TrainingGroup_pkey" PRIMARY KEY ("trainingGroupID")
);

-- CreateTable
CREATE TABLE "CycleGoal" (
    "cycleGoalID" SERIAL NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "mesoCycleID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CycleGoal_pkey" PRIMARY KEY ("cycleGoalID")
);

-- CreateTable
CREATE TABLE "CycleFeedback" (
    "cycleFeedbackID" SERIAL NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "mesoCycleID" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CycleFeedback_pkey" PRIMARY KEY ("cycleFeedbackID")
);

-- CreateTable
CREATE TABLE "MesoCycle" (
    "mesoCycleID" SERIAL NOT NULL,
    "trainingGroupID" INTEGER NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "period" VARCHAR(50) NOT NULL,
    "stage" VARCHAR(100) NOT NULL,
    "physicalScore" SMALLINT NOT NULL,
    "technicalScore" SMALLINT NOT NULL,
    "tacticalScore" SMALLINT NOT NULL,

    CONSTRAINT "MesoCycle_pkey" PRIMARY KEY ("mesoCycleID")
);

-- CreateTable
CREATE TABLE "MicroCycle" (
    "microCycleID" SERIAL NOT NULL,
    "mesoCycleID" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "speed" SMALLINT,
    "coordination" SMALLINT,
    "resistance" SMALLINT,
    "strength" SMALLINT,
    "individualLessons" SMALLINT,
    "groupLessons" SMALLINT,
    "pairWork" SMALLINT,
    "individualWork" SMALLINT,
    "technicalBasedCombats" SMALLINT,
    "trainingTournament" SMALLINT,
    "freeCombat" SMALLINT,
    "tacticalIndividualLesson" SMALLINT,
    "competitionAnalysis" SMALLINT,

    CONSTRAINT "MicroCycle_pkey" PRIMARY KEY ("microCycleID")
);

-- CreateTable
CREATE TABLE "DailyPlan" (
    "dailyPlanID" SERIAL NOT NULL,
    "microCycleID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activityTypeID" INTEGER NOT NULL,

    CONSTRAINT "DailyPlan_pkey" PRIMARY KEY ("dailyPlanID")
);

-- CreateTable
CREATE TABLE "ActivityType" (
    "activityTypeID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ActivityType_pkey" PRIMARY KEY ("activityTypeID")
);

-- CreateTable
CREATE TABLE "DailyPlanActivity" (
    "dailyPlanActivityID" SERIAL NOT NULL,
    "dailyPlanID" INTEGER NOT NULL,
    "activityID" INTEGER NOT NULL,

    CONSTRAINT "DailyPlanActivity_pkey" PRIMARY KEY ("dailyPlanActivityID")
);

-- CreateTable
CREATE TABLE "Activity" (
    "activityID" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,
    "activityTypeID" INTEGER NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("activityID")
);

-- CreateTable
CREATE TABLE "MacroCycle" (
    "macroCycleID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "results" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,

    CONSTRAINT "MacroCycle_pkey" PRIMARY KEY ("macroCycleID")
);

-- CreateTable
CREATE TABLE "PhysicalTest" (
    "physicalTestID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "trainerID" INTEGER NOT NULL,
    "results" TEXT NOT NULL,
    "feedback" TEXT NOT NULL,

    CONSTRAINT "PhysicalTest_pkey" PRIMARY KEY ("physicalTestID")
);

-- CreateTable
CREATE TABLE "TrainingCombat" (
    "trainingCombatID" SERIAL NOT NULL,
    "fencer1ID" INTEGER NOT NULL,
    "fencer2ID" INTEGER NOT NULL,
    "fencer1Score" SMALLINT NOT NULL,
    "fencer2Score" SMALLINT NOT NULL,
    "dateTime" TIMESTAMP NOT NULL,
    "winnerFencerID" INTEGER NOT NULL,

    CONSTRAINT "TrainingCombat_pkey" PRIMARY KEY ("trainingCombatID")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "attendanceID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "attended" BOOLEAN NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("attendanceID")
);

-- CreateTable
CREATE TABLE "AITraining" (
    "AITraining" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" TIMESTAMP(3) NOT NULL,
    "feedback" TEXT NOT NULL,
    "trainerID" INTEGER NOT NULL,

    CONSTRAINT "AITraining_pkey" PRIMARY KEY ("AITraining")
);

-- CreateTable
CREATE TABLE "RegistrationLink" (
    "registrationLinkID" SERIAL NOT NULL,
    "fencerID" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "valid" BOOLEAN NOT NULL,

    CONSTRAINT "RegistrationLink_pkey" PRIMARY KEY ("registrationLinkID")
);

-- CreateTable
CREATE TABLE "TrainingError" (
    "trainingErrorID" SERIAL NOT NULL,
    "AITrainingID" INTEGER NOT NULL,
    "errorID" INTEGER NOT NULL,
    "poseData" TEXT NOT NULL,

    CONSTRAINT "TrainingError_pkey" PRIMARY KEY ("trainingErrorID")
);

-- CreateTable
CREATE TABLE "Error" (
    "errorID" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Error_pkey" PRIMARY KEY ("errorID")
);

-- AddForeignKey
ALTER TABLE "Trainer" ADD CONSTRAINT "Trainer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fencer" ADD CONSTRAINT "Fencer_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fencer" ADD CONSTRAINT "Fencer_trainingGroupID_fkey" FOREIGN KEY ("trainingGroupID") REFERENCES "TrainingGroup"("trainingGroupID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleFeedback" ADD CONSTRAINT "SingleFeedback_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SingleFeedback" ADD CONSTRAINT "SingleFeedback_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleGoal" ADD CONSTRAINT "CycleGoal_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleGoal" ADD CONSTRAINT "CycleGoal_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleGoal" ADD CONSTRAINT "CycleGoal_mesoCycleID_fkey" FOREIGN KEY ("mesoCycleID") REFERENCES "MesoCycle"("mesoCycleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleFeedback" ADD CONSTRAINT "CycleFeedback_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleFeedback" ADD CONSTRAINT "CycleFeedback_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CycleFeedback" ADD CONSTRAINT "CycleFeedback_mesoCycleID_fkey" FOREIGN KEY ("mesoCycleID") REFERENCES "MesoCycle"("mesoCycleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesoCycle" ADD CONSTRAINT "MesoCycle_trainingGroupID_fkey" FOREIGN KEY ("trainingGroupID") REFERENCES "TrainingGroup"("trainingGroupID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MesoCycle" ADD CONSTRAINT "MesoCycle_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MicroCycle" ADD CONSTRAINT "MicroCycle_mesoCycleID_fkey" FOREIGN KEY ("mesoCycleID") REFERENCES "MesoCycle"("mesoCycleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPlan" ADD CONSTRAINT "DailyPlan_microCycleID_fkey" FOREIGN KEY ("microCycleID") REFERENCES "MicroCycle"("microCycleID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPlan" ADD CONSTRAINT "DailyPlan_activityTypeID_fkey" FOREIGN KEY ("activityTypeID") REFERENCES "ActivityType"("activityTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPlanActivity" ADD CONSTRAINT "DailyPlanActivity_dailyPlanID_fkey" FOREIGN KEY ("dailyPlanID") REFERENCES "DailyPlan"("dailyPlanID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyPlanActivity" ADD CONSTRAINT "DailyPlanActivity_activityID_fkey" FOREIGN KEY ("activityID") REFERENCES "Activity"("activityID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_activityTypeID_fkey" FOREIGN KEY ("activityTypeID") REFERENCES "ActivityType"("activityTypeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MacroCycle" ADD CONSTRAINT "MacroCycle_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MacroCycle" ADD CONSTRAINT "MacroCycle_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalTest" ADD CONSTRAINT "PhysicalTest_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalTest" ADD CONSTRAINT "PhysicalTest_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCombat" ADD CONSTRAINT "TrainingCombat_fencer1ID_fkey" FOREIGN KEY ("fencer1ID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCombat" ADD CONSTRAINT "TrainingCombat_fencer2ID_fkey" FOREIGN KEY ("fencer2ID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingCombat" ADD CONSTRAINT "TrainingCombat_winnerFencerID_fkey" FOREIGN KEY ("winnerFencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AITraining" ADD CONSTRAINT "AITraining_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AITraining" ADD CONSTRAINT "AITraining_trainerID_fkey" FOREIGN KEY ("trainerID") REFERENCES "Trainer"("trainerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistrationLink" ADD CONSTRAINT "RegistrationLink_fencerID_fkey" FOREIGN KEY ("fencerID") REFERENCES "Fencer"("fencerID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingError" ADD CONSTRAINT "TrainingError_AITrainingID_fkey" FOREIGN KEY ("AITrainingID") REFERENCES "AITraining"("AITraining") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingError" ADD CONSTRAINT "TrainingError_errorID_fkey" FOREIGN KEY ("errorID") REFERENCES "Error"("errorID") ON DELETE RESTRICT ON UPDATE CASCADE;
