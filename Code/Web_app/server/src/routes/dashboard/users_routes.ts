import { Router } from "express";

import {
  deleteUserById,
  getAllUsers,
  getOwnUser,
  getUserByEmail,
  getUserById,
  postUser,
  postUserAdmin,
  postUserFencer,
  postUserTrainer,
  updateUser,
} from "../../controllers/users_controller";
import { verifyRole } from "../../middlewares/roles_middlewares";

const router = Router();

router.get("/user/me", getOwnUser);
router.get("/user/:id", verifyRole(["admin", "trainer"]), getUserById);
router.get("/user/:email", verifyRole(["admin", "trainer"]), getUserByEmail); // TODO: this route gets shadowed by the one above
router.get("/user/", verifyRole(["admin", "trainer"]), getAllUsers);

router.put("/user/:id", verifyRole(["admin", "trainer"]), updateUser);
router.post("/user/admin", verifyRole(["admin", "trainer"]), postUserAdmin);
router.post("/user/trainer", verifyRole(["admin", "trainer"]), postUserTrainer);
router.post("/user/fencer", verifyRole(["admin", "trainer"]), postUserFencer);
router.post("/user/", verifyRole(["admin", "trainer"]), postUser);

router.delete("/user/:id", verifyRole(["admin"]), deleteUserById);

export default router;
