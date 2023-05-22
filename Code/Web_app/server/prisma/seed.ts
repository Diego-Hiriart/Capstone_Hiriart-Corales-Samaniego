import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const users = [
  {
    email: "pestrella@gmail.com",
    password: "$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4",
    names: "Patricio",
    lastNames: "Estrella",
    roles: ["fencer"],
  },
  {
    email: "mscott@gmail.com",
    password: "$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4",
    names: "Michael",
    lastNames: "Scott",
    roles: ["trainer"],
  },
  {
    email: "rsanchez@gmail.com",
    password: "$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4",
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
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
