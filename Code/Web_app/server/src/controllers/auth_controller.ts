import argon2 from "argon2";
import { Request, Response } from "express";

import { PrismaClient } from "@prisma/client";

import { generateToken, jwtSecret } from "../utils/jwt";
import { errorLog } from "../utils/logs";

const prisma = new PrismaClient();

/** To POST login route */
export async function login(req: Request, res: Response) {
  try {
    if (!req.body.user) throw new Error("Login attempt - User does not exist");

    if (await argon2.verify(req.body.user.password, req.body.password)) {
      req.headers.authorization = generateToken(req.body.user, jwtSecret);
    } else {
      throw new Error("Login attempt - User info does not match");
    }

    return res
      .cookie("token", req.headers.authorization, {
        httpOnly: true,
        secure: true,
      })
      .sendStatus(200);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(401);
  }
}

/** To POST signup route */
export async function signup(req: Request, res: Response) {
  try {
    if (req.body.user) throw new Error("Signup attempt - User already exists");

    const hash = await argon2.hash(req.body.password, {
      type: argon2.argon2id,
    });

    // Create user in DB
    await prisma.user.create({
      data: {
        names: req.body.names,
        lastNames: req.body.lastNames,
        email: req.body.email,
        password: hash,
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
    return res.clearCookie("token").status(201);
  } catch (error) {
    errorLog(error);
    return res.sendStatus(401);
  }
}
