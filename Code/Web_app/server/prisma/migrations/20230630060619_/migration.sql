/*
  Warnings:

  - Added the required column `logoURL` to the `AcademyConfig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademyConfig" ADD COLUMN     "logoURL" TEXT NOT NULL;
