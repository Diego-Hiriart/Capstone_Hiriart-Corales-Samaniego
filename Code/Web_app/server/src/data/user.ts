import { Fencer, PrismaClient, Trainer, User } from "@prisma/client";
import { removePasswordInUser } from "../utils/dataFilters";
import { hashPassword } from "../utils/hashPassword";

const prisma = new PrismaClient();

export async function findUserById(id: number) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userID: id,
      },
      include: {
        trainer: true,
        fencer: true,
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function findAllUsers() {
  try {
    const users = await prisma.user.findMany();
    return users.map((user) => removePasswordInUser(user));
  } catch (error) {
    throw error;
  }
}

export async function createUser(data: User) {
  try {
    const hashedPass = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPass,
        names: data.names,
        lastNames: data.lastNames,
        roles: data.roles,
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function createUserAdmin(data: User) {
  try {
    const hashedPass = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPass,
        names: data.names,
        lastNames: data.lastNames,
        roles: ["admin"],

        administrator: {
          create: {},
        },
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function createUserTrainer(data: User & Trainer) {
  try {
    const hashedPass = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPass,
        names: data.names,
        lastNames: data.lastNames,
        roles: ["trainer"],

        trainer: {
          create: {
            experience: data.experience,
            weapon: data.weapon,
            pictureURL: data.pictureURL,
          },
        },
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function createUserFencer(data: User & Fencer) {
  try {
    const hashedPass = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPass,
        names: data.names,
        lastNames: data.lastNames,
        roles: ["fencer"],
        fencer: {
          create: {
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
            inscriptionDate: new Date(),
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
            guestName: data.guestName,
          },
        },
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function softDeleteUserById(id: number) {
  try {
    const user = await prisma.user.update({
      where: {
        userID: id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function updateUserById(id: number, data: User) {
  try {
    const user = await prisma.user.update({
      where: {
        userID: id,
      },
      data: {
        email: data.email || undefined,
        password: data.password ? await hashPassword(data.password) : undefined,
        names: data.names || undefined,
        lastNames: data.lastNames || undefined,
        roles: data.roles || undefined,
      },
    });
    return user && removePasswordInUser(user);
  } catch (error) {
    throw error;
  }
}

export async function updatePassword(id: number, newPassword: string) {
  const user = await prisma.user.update({
    where: {
      userID: id,
    },
    data: {
      password: newPassword ? await hashPassword(newPassword) : undefined,
    },
  });
  return user && removePasswordInUser(user);
}
