import { Router } from "express";

import {
  deleteUserById,
  getAllUsers,
  getOwnUser,
  getUserByEmail,
  getUserById,
  postUser,
  postUserAdmin,
  postUserTrainer,
  putPassword,
  updateUser,
} from "../../controllers/users_controller";
import { verifyRole } from "../../middlewares/roles_middlewares";
import { verifyIfUserExists } from "../../middlewares/auth_middlewares";

const router = Router();

router.get("/user/me", getOwnUser);
router.get("/user/:id", verifyRole(["admin", "trainer"]), getUserById);
router.get("/user/:email", verifyRole(["admin", "trainer"]), getUserByEmail); // TODO: this route gets shadowed by the one above
router.get("/user/", verifyRole(["admin", "trainer"]), getAllUsers);

router.put("/user/:id", verifyRole(["admin", "trainer", "fencer"]), updateUser);
router.post("/user/admin", postUserAdmin);
router.post("/user/trainer", verifyRole(["admin", "trainer"]), postUserTrainer);
router.post("/user/", verifyRole(["admin", "trainer"]), postUser);

router.delete("/user/:id", verifyRole(["admin"]), deleteUserById);

router.put(
  "/user/:id/change-password",
  verifyIfUserExists,
  verifyRole(["admin", "trainer", "fencer"]),
  putPassword
);

export default router;
