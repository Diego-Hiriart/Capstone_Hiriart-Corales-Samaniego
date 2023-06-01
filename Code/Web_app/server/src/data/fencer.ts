import { PrismaClient, Fencer } from "@prisma/client";

const prisma = new PrismaClient();

type FencerWithUser = Fencer & {
  user: {
    names: string;
    lastNames: string;
    email: string;
  } | null;
};

export const filterFencersByName = (
  name: string,
  fencers: FencerWithUser[]
) => {
  const searchName = name.toLowerCase();
  const filtered = fencers.filter(
    (fencer) =>
      fencer.user?.lastNames.toLowerCase().startsWith(searchName) ||
      fencer.user?.names.toLowerCase().startsWith(searchName)
  );
  return filtered;
};

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

export async function addFencerToGroup(id: number, groupID: number) {
  try {
    const fencer = await prisma.fencer.update({
      where: {
        fencerID: id,
      },
      data: {
        trainingGroup: {
          connect: { trainingGroupID: groupID },
        },
      },
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}

export async function removeFencerFromGroup(id: number) {
  try {
    const fencer = await prisma.fencer.update({
      where: {
        fencerID: id,
      },
      data: {
        trainingGroup: {
          disconnect: true,
        },
      },
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}

export async function findAllFencer() {
  try {
    const fencers = await prisma.fencer.findMany({
      include: {
        user: {
          select: {
            names: true,
            lastNames: true,
            email: true,
          },
        },
      },
    });
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
        school: data.school,
        laterality: data.laterality,
        phone: data.phone,
        insurance: data.insurance,
        inscriptionDate: data.inscriptionDate,
        startDate: data.startDate,
        occupation: data.occupation,
        schedule: data.schedule,
        legalGuardian: data.legalGuardian,
        legalGuardianPhone: data.legalGuardianPhone,
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
      data,
    });
    return fencer;
  } catch (error) {
    throw error;
  }
}
