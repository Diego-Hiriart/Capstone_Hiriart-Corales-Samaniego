import { Fencer, PrismaClient, Trainer, User } from "@prisma/client";
import { hashPassword } from "../utils/hashPassword";
import { encryptData } from "../utils/database";

const prisma = new PrismaClient();

export function removePasswordInUser(user: User) {
  const obj: Partial<Pick<User, "password">> & Omit<User, "password"> = user;
  delete obj["password"];
  return obj;
}

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
        names: encryptData(data.names),
        lastNames: encryptData(data.lastNames),
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
            idNumber: encryptData(data.idNumber),
            emergencyPhone: encryptData(data.emergencyPhone),
            birthDate: encryptData(data.birthDate),
            bloodType: encryptData(data.bloodType),
            sex: encryptData(data.sex),
            school: data.school && encryptData(data.school),
            laterality: encryptData(data.laterality),
            phone: encryptData(data.phone),
            insurance: data.insurance && encryptData(data.insurance),
            inscriptionDate: encryptData(data.inscriptionDate.toString()),
            occupation: encryptData(data.occupation),
            schedule: encryptData(data.schedule),
            legalGuardian:
              data.legalGuardian && encryptData(data.legalGuardian),
            legalGuardianPhone:
              data.legalGuardianPhone && encryptData(data.legalGuardianPhone),
            leadSource: encryptData(data.leadSource),
            inscriptionReason: encryptData(data.inscriptionReason),
            height: encryptData(data.height),
            weight: encryptData(data.weight),
            physicalActivity:
              data.physicalActivity && encryptData(data.physicalActivity),
            medicalFamily: encryptData(data.medicalFamily),
            medicalPersonal: encryptData(data.medicalPersonal),
            personalMedicalDetails:
              data.personalMedicalDetails &&
              encryptData(data.personalMedicalDetails),
            weapon: encryptData(data.weapon),
            pictureURL: data.pictureURL && encryptData(data.pictureURL),
            guestName: data.guestName && encryptData(data.guestName),
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
