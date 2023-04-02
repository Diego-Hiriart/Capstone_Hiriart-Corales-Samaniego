import { Router } from "express";

import { login, logout, signup } from "../controllers/auth_controller";
import { verifyIfUserExists } from "../middlewares/auth_middlewares";

const router = Router();

// Users routes
router.post("/signup", verifyIfUserExists, signup);
router.post("/login", verifyIfUserExists, login);
router.post("/logout", logout);

export default router;
