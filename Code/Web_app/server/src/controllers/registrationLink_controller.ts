import { Request, Response } from "express";

import {
  createRegistrationLink,
  deleteRegistrationLinkById,
  findAllRegistrationLink,
  findRegistrationLinkById,
  updateRegistrationLinkById,
} from "../data/registrationLink";
import { errorLog } from "../utils/logs";

export async function getRegistrationLinkById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findRegistrationLinkById(Number(req.params.id)),
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
