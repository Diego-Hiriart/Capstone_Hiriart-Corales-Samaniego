import { PrismaClient, Fencer } from "@prisma/client";

const prisma = new PrismaClient();

export async function findFencerById(id: number) {
  try {
    const fencer = await prisma.fencer.findUnique({
      where: {
        fencerID: id,
      },
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}

export async function findAllFencer() {
  try {
    const fencers = await prisma.fencer.findMany();
    return fencers;
  } catch (error) {
    throw error;
  }
}

export async function createFencer(data: Fencer) {
  try {
    const fencer = await prisma.fencer.create({
      data: {
        userID: data.userID,
        trainingGroupID: data.trainingGroupID,
        idNumber: data.idNumber,
        emergencyPhone: data.emergencyPhone,
        birthDate: data.birthDate,
        bloodType: data.bloodType,
        sex: data.sex,
        laterality: data.laterality,
        phone: data.phone,
        insurance: data.insurance,
        inscriptionDate: data.inscriptionDate,
        startDate: data.startDate,
        occupation: data.occupation,
        schedule: data.schedule,
        legalGuardian: data.legalGuardian,
        leadSource: data.leadSource,
        inscriptionReason: data.inscriptionReason,
        height: data.height,
        weight: data.weight,
        physicalActivity: data.physicalActivity,
        medicalFamily: data.medicalFamily,
        medicalPersonal: data.medicalPersonal,
        personalMedicalDetails: data.personalMedicalDetails,
        weapon: data.weapon,
        pictureURL: data.pictureURL,
      },
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}

export async function updateFencerById(id: number, data: Fencer) {
  try {
    const fencer = await prisma.fencer.update({
      where: {
        fencerID: id,
      },
      data: {
        userID: data.userID || undefined,
        trainingGroupID: data.trainingGroupID || undefined,
        idNumber: data.idNumber || undefined,
        emergencyPhone: data.emergencyPhone || undefined,
        birthDate: data.birthDate || undefined,
        bloodType: data.bloodType || undefined,
        sex: data.sex || undefined,
        laterality: data.laterality || undefined,
        phone: data.phone || undefined,
        insurance: data.insurance || undefined,
        inscriptionDate: data.inscriptionDate || undefined,
        startDate: data.startDate || undefined,
        occupation: data.occupation || undefined,
        schedule: data.schedule || undefined,
        legalGuardian: data.legalGuardian || undefined,
        leadSource: data.leadSource || undefined,
        inscriptionReason: data.inscriptionReason || undefined,
        height: data.height || undefined,
        weight: data.weight || undefined,
        physicalActivity: data.physicalActivity || undefined,
        medicalFamily: data.medicalFamily || undefined,
        medicalPersonal: data.medicalPersonal || undefined,
        personalMedicalDetails: data.personalMedicalDetails || undefined,
        weapon: data.weapon || undefined,
        pictureURL: data.pictureURL || undefined,
      },
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}
