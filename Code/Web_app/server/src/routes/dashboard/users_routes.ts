import { Router } from "express";

import {
  deleteUserById,
  getAllUsers,
  getOwnUser,
  getUserByEmail,
  getUserById,
} from "../../controllers/users_controller";
import { verifyRole } from "../../middlewares/roles_middlewares";

const router = Router();

router.get("/user/me", getOwnUser);
router.get("/user/:email", verifyRole(["admin", "trainer"]), getUserByEmail);
router.get("/user/:id", verifyRole(["admin", "trainer"]), getUserById);
router.get("/user/", verifyRole(["admin", "trainer"]), getAllUsers);
router.delete("/user/:id", verifyRole(["admin"]), deleteUserById);

export default router;
