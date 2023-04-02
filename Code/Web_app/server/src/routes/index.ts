import express from "express";

import { verifyToken } from "../middlewares/auth_middlewares";
import auth_routes from "./auth_routes";
import home_routes from "./home_routes";

const router = express.Router();

router.use("/auth", auth_routes); // Login, singup, etc
router.use("/dashboard", verifyToken, () => {}); // Logged users routes
router.use("/", home_routes);

export default router;
