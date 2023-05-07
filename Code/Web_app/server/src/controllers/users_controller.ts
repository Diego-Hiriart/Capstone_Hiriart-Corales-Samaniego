import { Request, Response } from "express";

import {
  findAllUsers,
  findUserByEmail,
  findUserById,
  softDeleteUserById,
} from "../data/user";
import { errorLog } from "../utils/logs";

/** GET own user */
export async function getOwnUser(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findUserById(Number(req.body.user.userID)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

/** GET all users */
export async function getAllUsers(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findAllUsers(),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

/** GET user by id */
export async function getUserById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findUserById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

/** GET user by email sent through the body */
export async function getUserByEmail(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findUserByEmail(req.params.email),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

/** To DELETE one user route */
export async function deleteUserById(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await softDeleteUserById(Number(req.params.id)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}
