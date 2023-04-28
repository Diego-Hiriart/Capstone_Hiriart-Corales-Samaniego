import { NextFunction, Request, Response } from "express";

import { warnLog } from "../utils/logs";

export type Permissions = "admin" | "fencer" | "trainer";

// Verify the user roles
export function verifyRole(permissions: Permissions[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // For debugging issues managing it like this
    // When adding all the tables and roles, fix
    const roles = req.body.user.roles || req.body.roles;

    if (!permissions.some((role) => roles.includes(role))) {
      warnLog("User not authorized");
      return res.sendStatus(401);
    }

    next();
  };
}
