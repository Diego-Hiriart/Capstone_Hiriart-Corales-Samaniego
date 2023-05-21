import { PrismaClient, RegistrationLink } from "@prisma/client";
import { addWeeksToDate } from "../utils/dates";

const prisma = new PrismaClient();

export async function findRegistrationLinkByEmail(email: string) {
  try {
    const registrationLink = await prisma.registrationLink.findFirst({
      where: {
        email: email,
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
        expirationDate: addWeeksToDate(new Date(), 2),
        valid: data.valid || true,
        email: data.email,
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
        expirationDate: data.expirationDate || undefined,
        valid: data.valid || undefined,
        email: data.email || undefined,
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
