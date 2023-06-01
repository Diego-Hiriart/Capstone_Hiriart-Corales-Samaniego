import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const password =
  "$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4";
// password123

const users = [
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
    password: password,
    names: "Luis",
    lastNames: "Corales",
    roles: ["admin"],
  },
];

const fencers = [
  {
    userID: 1,
    trainingGroupID: 1,
    idNumber: "1707217293",
    emergencyPhone: "0979349191",
    birthDate: new Date(),
    bloodType: "O+",
    sex: "M",
    school: null,
    laterality: "D",
    phone: "0979349191",
    insurance: null,
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: "Student",
    schedule: "Tarde",
    legalGuardian: null,
    legalGuardianPhone: null,
    leadSource: "Redes Sociales",
    inscriptionReason: "Hobby",
    height: 123,
    weight: 123,
    physicalActivity: null,
    medicalFamily: "",
    medicalPersonal: "",
    personalMedicalDetails: "Diabetes",
    weapon: "Espada",
    pictureURL: null,
  },
  {
    userID: 4,
    trainingGroupID: 1,
    idNumber: "1707217293",
    emergencyPhone: "0979349191",
    birthDate: new Date(),
    bloodType: "O+",
    sex: "M",
    school: "Gotitas del saber",
    laterality: "D",
    phone: "0979349191",
    insurance: "Seguros Equinoccial",
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: "Student",
    schedule: "Tarde",
    legalGuardian: "Marco Padilla",
    legalGuardianPhone: "0979349191",
    leadSource: "Redes Sociales",
    inscriptionReason: "Hobby",
    height: 123,
    weight: 123,
    physicalActivity: "Futbol",
    medicalFamily: "",
    medicalPersonal: "",
    personalMedicalDetails: "Diabetes",
    weapon: "Espada",
    pictureURL: null,
  },
];

const trainers = [
  {
    userID: 2,
    experience: "123",
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

const feedbacks = [
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: "Feedback 1",
  },
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: "Feedback 2",
  },
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: "Feedback 3",
  },
];

async function main() {
  await prisma.user.createMany({
    data: users,
  });
  await prisma.trainer.createMany({
    data: trainers,
  });
  await prisma.trainingGroup.createMany({
    data: trainingGroups,
  });
  await prisma.fencer.createMany({
    data: fencers,
  });
  await prisma.singleFeedback.createMany({
    data: feedbacks,
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
