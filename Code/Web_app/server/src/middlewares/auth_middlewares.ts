import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";

import { jwtSecret } from "../utils/jwt";
import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

// Verify if the user already exists
export async function verifyIfUserExists(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Null or user object
    req.body.user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    next();
  } catch (error) {
    errorLog(error);
    return res.sendStatus(403);
  }
}

// Verify user token is valid
// TO DO: More secure
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.token;

    if (token === undefined)
      throw new Error("Couldn't verify token: Token does not exist");

    jwt.verify(token, jwtSecret, (error: any, user: any) => {
      if (error) throw error;
      req.body.user = user;
    });

    next();
  } catch (error) {
    errorLog(error);
    return res.sendStatus(401);
  }
}

// Verify the user is admin
// TO DO: Complete
export function verifyAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    next();
  } catch (error) {
    errorLog(error);
    return res.sendStatus(401);
  }
}
