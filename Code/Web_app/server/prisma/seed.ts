import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hashPassword";

const prisma = new PrismaClient();

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
        email: "luis@gmail.com",
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
