import { Router } from "express";

import { login, logout, signup, verifyEmailExists } from "../controllers/auth_controller";
import { verifyIfUserExists } from "../middlewares/auth_middlewares";
import { postUserFencer } from "../controllers/users_controller";
import { checkTokenValid } from "../controllers/registrationLink_controller";

const router = Router();

router.post("/signup", verifyIfUserExists, signup);
router.post("/login", verifyIfUserExists, login);
router.post("/logout", logout);
router.post("/user/fencer", postUserFencer);
router.post("/verifyEmail", verifyEmailExists);
router.post("/registration_link/check", checkTokenValid);

export default router;
