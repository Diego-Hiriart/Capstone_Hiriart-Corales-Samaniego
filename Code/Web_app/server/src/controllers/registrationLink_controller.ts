import { Request, Response } from "express";

import {
  createRegistrationLink,
  deleteRegistrationLinkById,
  findAllRegistrationLink,
  findRegistrationLinkByEmail,
  updateRegistrationLinkById,
} from "../data/registrationLink";
import { errorLog } from "../utils/logs";

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
    return res.status(200).json({
      data,
      link: `${process.env.WEB_URL}/signup?email=${data.email}`,
    });
  } catch (error) {
    errorLog(error);

    return res
      .status(500)
      .json({ message: "This email was already registered" });
  }
}
