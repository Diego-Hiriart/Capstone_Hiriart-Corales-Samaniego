import argon2 from "argon2";
import { Request, Response } from "express";

import { PrismaClient, User } from "@prisma/client";

import { generateToken, jwtSecret } from "../utils/jwt";
import { errorLog } from "../utils/logs";
import { hashPassword } from "../utils/hashPassword";
import { findUserByEmail } from "../data/user";

const prisma = new PrismaClient();

/** To POST login route */
export async function login(req: Request, res: Response) {
  try {
    const user: User = req.body.user;

    if (!user) throw new Error("Login attempt - User does not exist");

    if (user.deletedAt) throw new Error("Login attempt - User deactivated");

    if (await argon2.verify(user.password, req.body.password)) {
      req.headers.authorization = generateToken(user, jwtSecret);
    } else {
      throw new Error("Login attempt - User info does not match");
    }

    return res
      .cookie("token", req.headers.authorization, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({
        user: user,
      });
  } catch (error) {
    errorLog(error);
    if (error instanceof Error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  }
}

/** To POST signup route */
export async function signup(req: Request, res: Response) {
  try {
    if (req.body.user) throw new Error("Signup attempt - User already exists");

    const hash = await hashPassword(req.body.password);

    // Create user in DB
    await prisma.user.create({
      data: {
        names: req.body.names,
        lastNames: req.body.lastNames,
        email: req.body.email,
        password: hash,
        roles: ["fencer"],
      },
    });

    return res.sendStatus(201);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(500);
  }
}

/** To POST logout route */
export async function logout(req: Request, res: Response) {
  try {
    return res.clearCookie("token").status(201).send();
  } catch (error) {
    errorLog(error);
    return res.sendStatus(401);
  }
}

export async function verifyEmailExists(req: Request, res: Response) {
  const user = await findUserByEmail(req.body.email);
  if (user) {
    return res.sendStatus(409);
  } else {
    return res.sendStatus(200);
  }
}
