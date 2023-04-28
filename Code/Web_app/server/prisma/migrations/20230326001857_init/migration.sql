-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "Email" TEXT NOT NULL,
    "Names" TEXT NOT NULL,
    "LastNames" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "AdministratorID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("AdministratorID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;
