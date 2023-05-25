import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hashPassword";

const prisma = new PrismaClient();

const fencers = [
  {
    userID: 1,
    trainingGroupID: 1,
    idNumber: "111",
    emergencyPhone: "123",
    birthDate: new Date(),
    bloodType: "123",
    sex: "123",
    laterality: "123",
    phone: "123",
    insurance: "123",
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: "123",
    schedule: "123",
    legalGuardian: "123",
    leadSource: "123",
    inscriptionReason: "123",
    height: 123,
    weight: 123,
    physicalActivity: "123",
    medicalFamily: "123",
    medicalPersonal: "123",
    personalMedicalDetails: "123",
    weapon: "123",
    pictureURL: "123",
  },
  {
    userID: 4,
    trainingGroupID: 1,
    idNumber: "222",
    emergencyPhone: "123",
    birthDate: new Date(),
    bloodType: "123",
    sex: "1",
    laterality: "1",
    phone: "123",
    insurance: "123",
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: "123",
    schedule: "123",
    legalGuardian: "123",
    leadSource: "123",
    inscriptionReason: "123",
    height: 123,
    weight: 123,
    physicalActivity: "123",
    medicalFamily: "123",
    medicalPersonal: "123",
    personalMedicalDetails: "123",
    weapon: "123",
    pictureURL: "123",
  },
];

const trainingGroups = [
  {
    name: "Grupo 1",
    weapon: "Florete",
  },
  {
    name: "Grupo 2",
    weapon: "Sable",
  },
  {
    name: "Grupo 3",
    weapon: "Espada",
  },
];

async function main() {
  const password = await hashPassword("password123");

  await prisma.user.createMany({
    data: [
      {
        email: "pestrella@gmail.com",
        password: password,
        names: "Patricio",
        lastNames: "Estrella",
        roles: ["fencer"],
      },
      {
        email: "mscott@gmail.com",
        password: password,
        names: "Michael",
        lastNames: "Scott",
        roles: ["trainer"],
      },
      {
        email: "rsanchez@gmail.com",
        password: password,
        names: "Rick",
        lastNames: "Sanchez",
        roles: ["admin"],
      },
      {
        email: "jpadilla@gmail.com",
        password: password,
        names: "Jorge",
        lastNames: "Padilla",
        roles: ["fencer"],
      },
      {
        email: "lcorales@gmail.com",
        password: await hashPassword("12345678"),
        names: "Luis",
        lastNames: "Corales",
        roles: ["admin"],
      },
    ],
  });
  await prisma.trainingGroup.createMany({
    data: trainingGroups,
  });
  await prisma.fencer.createMany({
    data: fencers,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
