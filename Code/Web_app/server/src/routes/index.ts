import express from "express";
import home_routes from "./home_routes";
import auth_routes from "./auth_routes";

const router = express.Router();

router.use("/auth", auth_routes); // Login, sing up, etc
router.use("/dashboard", () => {}); // Logged users routes
router.use("/", home_routes);

export default router;
