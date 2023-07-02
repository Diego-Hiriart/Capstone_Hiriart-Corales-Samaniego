/*
  Warnings:

  - A unique constraint covering the columns `[systemName]` on the table `Error` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Error_systemName_key" ON "Error"("systemName");
