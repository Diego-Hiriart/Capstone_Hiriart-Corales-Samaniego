-- CreateTable
CREATE TABLE "MachineCombatData" (
    "machineName" TEXT NOT NULL,
    "leftScore" INTEGER NOT NULL,
    "rightScore" INTEGER NOT NULL,
    "dateTime" TIMESTAMP(3) NOT NULL,
    "leftPriority" BOOLEAN NOT NULL,
    "rightPriority" BOOLEAN NOT NULL,

    CONSTRAINT "MachineCombatData_pkey" PRIMARY KEY ("machineName")
);
