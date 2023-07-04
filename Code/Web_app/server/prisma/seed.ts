import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const password =
  '$argon2id$v=19$m=65536,t=3,p=4$QlqQtAUgua3rh18ufw/CwQ$K+YgFptK2/uBuf8KIMHtt+/8bgkTW/LM9gc7otNUAu4';
// password123

const users = [
  {
    email: 'pestrella@gmail.com',
    password: password,
    names: 'Patricio',
    lastNames: 'Estrella',
    roles: ['fencer'],
  },
  {
    email: 'mscott@gmail.com',
    password: password,
    names: 'Michael',
    lastNames: 'Scott',
    roles: ['trainer'],
  },
  {
    email: 'rsanchez@gmail.com',
    password: password,
    names: 'Rick',
    lastNames: 'Sanchez',
    roles: ['admin'],
  },
  {
    email: 'jpadilla@gmail.com',
    password: password,
    names: 'Jorge',
    lastNames: 'Padilla',
    roles: ['fencer'],
  },
  {
    email: 'lcorales@gmail.com',
    password: password,
    names: 'Luis',
    lastNames: 'Corales',
    roles: ['admin'],
  },
];

const fencers = [
  {
    userID: 1,
    trainingGroupID: 1,
    idNumber: '1707217293',
    emergencyPhone: '0979349191',
    birthDate: new Date(),
    bloodType: 'O+',
    sex: 'M',
    school: null,
    laterality: 'D',
    phone: '0979349191',
    insurance: 'BMI',
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: 'Student',
    schedule: 'Tarde',
    legalGuardian: 'Luis Corales',
    legalGuardianPhone: '0999999999',
    leadSource: 'Redes Sociales',
    inscriptionReason: 'Hobby',
    height: 123,
    weight: 123,
    physicalActivity: 'Some',
    medicalFamily: `{"familyBoneDisease":true,"familyAllergies":true,"familyAsthma":true,"familyPregnancy":true,"familyHospitalization":true,"familyDrugs":true,"familyHypertension":true,"familyHypotension":true,"familyPsychological":true,"familyOther":false,"familyOtherDetails":null}`,
    medicalPersonal: `{"personalHeartDisease":true,"personalHeartAttack":true,"personalDiabetes":true,"personalCholesterol":true,"personalHypertension":true,"personalHypotension":true}`,
    personalMedicalDetails: 'Diabetes',
    weapon: 'Espada',
    pictureURL: null,
  },
  {
    userID: 4,
    trainingGroupID: 1,
    idNumber: '1707217293',
    emergencyPhone: '0979349191',
    birthDate: new Date(),
    bloodType: 'O+',
    sex: 'M',
    school: 'Gotitas del saber',
    laterality: 'D',
    phone: '0979349191',
    insurance: 'Seguros Equinoccial',
    inscriptionDate: new Date(),
    startDate: new Date(),
    occupation: 'Student',
    schedule: 'Tarde',
    legalGuardian: 'Marco Padilla',
    legalGuardianPhone: '0979349191',
    leadSource: 'Redes Sociales',
    inscriptionReason: 'Hobby',
    height: 123,
    weight: 123,
    physicalActivity: 'Futbol',
    medicalFamily: `{"familyBoneDisease":true,"familyAllergies":true,"familyAsthma":true,"familyPregnancy":true,"familyHospitalization":true,"familyDrugs":true,"familyHypertension":true,"familyHypotension":true,"familyPsychological":true,"familyOther":false,"familyOtherDetails":null}`,
    medicalPersonal: `{"personalHeartDisease":true,"personalHeartAttack":true,"personalDiabetes":true,"personalCholesterol":true,"personalHypertension":true,"personalHypotension":true}`,
    personalMedicalDetails: 'Diabetes',
    weapon: 'Espada',
    pictureURL: null,
  },
];

const trainers = [
  {
    userID: 2,
    experience: 'Too much',
    weapon: 'Sable',
  },
];

const trainingGroups = [
  {
    name: 'Grupo 1',
    weapon: 'Florete',
  },
  {
    name: 'Grupo 2',
    weapon: 'Sable',
  },
  {
    name: 'Grupo 3',
    weapon: 'Espada',
  },
];

const feedbacks = [
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: 'Feedback 1',
  },
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: 'Feedback 2',
  },
  {
    fencerID: 1,
    trainerID: 1,
    date: new Date(),
    content: 'Feedback 3',
  },
];

const trainingExercises = [
  {
    trainingExerciseID: 1,
    name: "Exercise 1",
    description: "Exercise Description 1",
  },
];

const aiTrainings = [
  {
    fencerID: 1,
    date: new Date(),
    duration: 120,
    feedback: 'Feedback training ai',
    trainerID: 1,
    trainingExerciseID: 1,
    name: 'Exercise 1',
    description: 'Exercise Description 1',
  },
];

const errors = [
  {
    name: "Error 1",
    description: "Error Description 1",
    correctPose: "json pose",
    systemName: "AI name"
  },
];

const trainingErrors = [
  {
    AITrainingID: 1,
    errorID: 1,
    poseData: 'Pose data 1',
  },
];

const machineCombatData = [
  {
    machineName: 'mach1',
    leftScore: 2,
    rightScore: 15,
    dateTime: new Date('2000/12/01'),
    leftPriority: true,
    rightPriority: false,
  },
  {
    machineName: 'mach1',
    leftScore: 15,
    rightScore: 2,
    dateTime: new Date('1999/12/01'),
    leftPriority: true,
    rightPriority: false,
  },
  {
    machineName: 'mach2',
    leftScore: 30,
    rightScore: 30,
    dateTime: new Date(),
    leftPriority: true,
    rightPriority: false,
  },
];

const config = {
  name: 'Academia de Esgrima Ciudad de Quito',
  phoneNumber: '1234567890',
  address: 'Quito',
  logoURL: '',
};

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
  await prisma.trainingExercise.createMany({
    data: trainingExercises,
  });
  await prisma.aITraining.createMany({
    data: aiTrainings,
  });
  await prisma.error.createMany({
    data: errors,
  });
  await prisma.trainingError.createMany({
    data: trainingErrors,
  });
  await prisma.machineCombatData.createMany({
    data: machineCombatData,
  });
  await prisma.academyConfig.create({
    data: config,
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
