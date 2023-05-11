import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const users = [
  {
    email: "pestrella@gmail.com",
    password: "password123",
    names: "Patricio",
    lastNames: "Estrella",
    roles: ["fencer"],
  },
  {
    email: "mscott@gmail.com",
    password: "password123",
    names: "Michael",
    lastNames: "Scott",
    roles: ["trainer"],
  },
  {
    email: "rsanchez@gmail.com",
    password: "password123",
    names: "Rick",
    lastNames: "Sanchez",
    roles: ["admin"],
  },
];

async function main() {
  await prisma.user.createMany({
    data: users,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
