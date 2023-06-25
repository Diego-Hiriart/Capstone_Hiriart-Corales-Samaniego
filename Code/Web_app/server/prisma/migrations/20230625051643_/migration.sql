/*
  Warnings:

  - The primary key for the `MachineCombatData` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "MachineCombatData" DROP CONSTRAINT "MachineCombatData_pkey",
ADD COLUMN     "machineCombatDataID" SERIAL NOT NULL,
ADD CONSTRAINT "MachineCombatData_pkey" PRIMARY KEY ("machineCombatDataID");
