import { PrismaClient, RegistrationLink } from "@prisma/client";

const prisma = new PrismaClient();

export async function findRegistrationLinkById(id: number) {
  try {
    const registrationLink = await prisma.registrationLink.findUnique({
      where: {
        registrationLinkID: id,
      },
    });
    return registrationLink;
  } catch (error) {
    throw error;
  }
}

export async function findAllRegistrationLink() {
  try {
    const registrationLink = await prisma.registrationLink.findMany();
    return registrationLink;
  } catch (error) {
    throw error;
  }
}

export async function createRegistrationLink(data: RegistrationLink) {
  try {
    const registrationLink = await prisma.registrationLink.create({
      data: {
        fencerID: data.fencerID,
        expirationDate: data.expirationDate,
        valid: data.valid,
      },
    });
    return registrationLink;
  } catch (error) {
    throw error;
  }
}

export async function updateRegistrationLinkById(
  id: number,
  data: RegistrationLink
) {
  try {
    const registrationLink = await prisma.registrationLink.update({
      where: {
        registrationLinkID: id,
      },
      data: {
        fencerID: data.fencerID || undefined,
        expirationDate: data.expirationDate || undefined,
        valid: data.valid || undefined,
      },
    });
    return registrationLink;
  } catch (error) {
    throw error;
  }
}

export async function deleteRegistrationLinkById(id: number) {
  try {
    const registrationLink = await prisma.registrationLink.delete({
      where: {
        registrationLinkID: id,
      },
    });
    return registrationLink;
  } catch (error) {
    throw error;
  }
}
