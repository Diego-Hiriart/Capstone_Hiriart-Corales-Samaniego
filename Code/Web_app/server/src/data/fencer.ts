import { PrismaClient, Fencer } from "@prisma/client";

import { errorLog } from "../utils/logs";

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
    errorLog(error);
    return undefined;
  }
}

export async function findAllFencer() {
  try {
    const fencers = await prisma.fencer.findMany();
    return fencers;
  } catch (error) {
    errorLog(error);
    return [];
  }
}

export async function updateUserById(id: number, data: Fencer) {
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
    errorLog(error);
    return undefined;
  }
}
