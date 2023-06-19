import { PrismaClient } from "@prisma/client";
import { encryptData } from "../src/utils/database";

const prisma = new PrismaClient();
const password =
  "$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4";
// password123

const users = [
  {
    email: "pestrella@gmail.com",
    password: password,
    names: encryptData("Patricio"),
    lastNames: encryptData("Estrella"),
    roles: ["fencer"],
  },
  {
    email: "mscott@gmail.com",
    password: password,
    names: encryptData("Michael"),
    lastNames: encryptData("Scott"),
    roles: ["trainer"],
  },
  {
    email: "rsanchez@gmail.com",
    password: password,
    names: encryptData("Rick"),
    lastNames: encryptData("Sanchez"),
    roles: ["admin"],
  },
  {
    email: "jpadilla@gmail.com",
    password: password,
    names: encryptData("Jorge"),
    lastNames: encryptData("Padilla"),
    roles: ["fencer"],
  },
  {
    email: "lcorales@gmail.com",
    password: password,
    names: encryptData("Luis"),
    lastNames: encryptData("Corales"),
    roles: ["admin"],
  },
];

const fencers = [
  {
    userID: 1,
    trainingGroupID: 1,
    idNumber: encryptData("1707217293"),
    emergencyPhone: encryptData("0979349191"),
    birthDate: encryptData(new Date().toString()),
    bloodType: encryptData("O+"),
    sex: encryptData("M"),
    school: null,
    laterality: encryptData("D"),
    phone: encryptData("0979349191"),
    insurance: encryptData("BMI"),
    inscriptionDate: encryptData(new Date().toString()),
    startDate: encryptData(new Date().toString()),
    occupation: encryptData("Student"),
    schedule: "Tarde",
    legalGuardian: "Luis Corales",
    legalGuardianPhone: "0999999999",
    leadSource: "Redes Sociales",
    inscriptionReason: "Hobby",
    height: 123,
    weight: 123,
    physicalActivity: "Some",
    medicalFamily: `{"familyBoneDisease":true,"familyAllergies":true,"familyAsthma":true,"familyPregnancy":true,"familyHospitalization":true,"familyDrugs":true,"familyHypertension":true,"familyHypotension":true,"familyPsychological":true,"familyOther":false,"familyOtherDetails":null}`,
    medicalPersonal: `{"personalHeartDisease":true,"personalHeartAttack":true,"personalDiabetes":true,"personalCholesterol":true,"personalHypertension":true,"personalHypotension":true}`,
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
    medicalFamily: `{"familyBoneDisease":true,"familyAllergies":true,"familyAsthma":true,"familyPregnancy":true,"familyHospitalization":true,"familyDrugs":true,"familyHypertension":true,"familyHypotension":true,"familyPsychological":true,"familyOther":false,"familyOtherDetails":null}`,
    medicalPersonal: `{"personalHeartDisease":true,"personalHeartAttack":true,"personalDiabetes":true,"personalCholesterol":true,"personalHypertension":true,"personalHypotension":true}`,
    personalMedicalDetails: "Diabetes",
    weapon: "Espada",
    pictureURL: null,
  },
];

const trainers = [
  {
    userID: 2,
    experience: "Too much",
    weapon: "Sable",
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
