/*
  Warnings:

  - The primary key for the `Administrator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `AdministratorID` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Administrator` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `CreatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `DeletedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LastNames` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Names` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `Password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userID` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastNames` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `names` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_UserID_fkey";

-- DropIndex
DROP INDEX "User_Email_key";

-- AlterTable
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_pkey",
DROP COLUMN "AdministratorID",
DROP COLUMN "UserID",
ADD COLUMN     "administratorID" SERIAL NOT NULL,
ADD COLUMN     "userID" INTEGER NOT NULL,
ADD CONSTRAINT "Administrator_pkey" PRIMARY KEY ("administratorID");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "CreatedAt",
DROP COLUMN "DeletedAt",
DROP COLUMN "Email",
DROP COLUMN "LastNames",
DROP COLUMN "Names",
DROP COLUMN "Password",
DROP COLUMN "UpdatedAt",
DROP COLUMN "UserID",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "lastNames" TEXT NOT NULL,
ADD COLUMN     "names" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
