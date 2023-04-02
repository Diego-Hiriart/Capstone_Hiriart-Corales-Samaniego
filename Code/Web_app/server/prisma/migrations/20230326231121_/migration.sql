/*
  Warnings:

  - Added the required column `DeletedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "DeletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Password" TEXT NOT NULL;
