import { Request, Response } from "express";

import {
  createUser,
  createUserAdmin,
  createUserFencer,
  createUserTrainer,
  findAllUsers,
  findUserByEmail,
  findUserById,
  softDeleteUserById,
  updateUserById,
} from "../data/user";
import { errorLog } from "../utils/logs";
import { Prisma } from "@prisma/client";

/** GET own user */
export async function getOwnUser(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await findUserById(Number(req.body.user.userID)), //Q: porque cambio a req.body.id?
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
      data: await softDeleteUserById(Number(req.body.userID)),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await updateUserById(Number(req.body.userID), req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postUser(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createUser(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postUserAdmin(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createUserAdmin(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

export async function postUserFencer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createUserFencer(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "El correo ingresado ya está en uso.",
        });
      }
    }
    return res.sendStatus(500);
  }
}

export async function postUserTrainer(req: Request, res: Response) {
  try {
    return res.status(200).json({
      data: await createUserTrainer(req.body.data),
    });
  } catch (error) {
    errorLog(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return res.status(409).json({
          error: "El correo ingresado ya está en uso.",
        });
      }
    }
    return res.sendStatus(500);
  }
}
