/*
  Warnings:

  - Added the required column `correctPose` to the `Error` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Error" ADD COLUMN     "correctPose" TEXT NOT NULL;