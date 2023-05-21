/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `RegistrationLink` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RegistrationLink_email_key" ON "RegistrationLink"("email");
