import { Router } from "express";

import { login, logout, signup } from "../controllers/auth_controller";
import { verifyIfUserExists } from "../middlewares/auth_middlewares";
import { postUserFencer } from "../controllers/users_controller";

const router = Router();

router.post("/signup", verifyIfUserExists, signup);
router.post("/login", verifyIfUserExists, login);
router.post("/logout", logout);
router.post("/user/fencer", postUserFencer);

export default router;
