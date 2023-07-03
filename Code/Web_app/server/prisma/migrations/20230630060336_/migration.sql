-- CreateTable
CREATE TABLE "AcademyConfig" (
    "academyConfigID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "AcademyConfig_pkey" PRIMARY KEY ("academyConfigID")
);
