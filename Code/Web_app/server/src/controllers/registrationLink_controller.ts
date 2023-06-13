import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  createRegistrationLink,
  deleteRegistrationLinkById,
  findAllRegistrationLink,
  findRegistrationLinkByEmail,
  updateRegistrationLinkById,
} from "../data/registrationLink";
import { generateRegistrationToken, jwtSecret } from "../utils/jwt";
import { errorLog } from "../utils/logs";
import { RegistrationLink } from "@prisma/client";

export async function getRegistrationLinkByToken(req: Request, res: Response) {
  try {
    const token = req.query.t?.toString() ?? "";
    const data = jwt.verify(token, jwtSecret);

    req.body.data = data;

    return res.status(200).json({
      data: await findRegistrationLinkByEmail(req.body.data.email),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getRegistrationLinkByEmail(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findRegistrationLinkByEmail(req.params.email),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function getAllRegistrationLink(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllRegistrationLink(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postRegistrationLink(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createRegistrationLink(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateRegistrationLink(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateRegistrationLinkById(
        Number(req.params.id),
        req.body.data
      ),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function deleteRegistrationLink(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await deleteRegistrationLinkById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postGenerateLink(req: Request, res: Response) {
  try {
    if (await findRegistrationLinkByEmail(req.body.data.email)) {
      throw new Error("Generate Link - This email was already registered");
    }

    const data = await createRegistrationLink(req.body.data);
    const token = generateRegistrationToken(data, jwtSecret);

    return res.status(200).json({
      link: `${process.env.CLIENT_URL}/signup?t=${token}`,
    });
  } catch (error) {
    errorLog(error);

    return res
      .status(500)
      .json({ message: "This email was already registered" });
  }
}

export async function checkTokenValid(req: Request, res: Response) {
  try {
    const token = req.query.t?.toString() ?? "";
    const tokenData = jwt.verify(token, jwtSecret) as RegistrationLink;
    const link = await findRegistrationLinkByEmail(tokenData.email);
    if (!link) {
      throw new Error("Token invalid");
    }
    return res.sendStatus(200);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
