import { Router } from "express";

import {
  deleteActivity,
  getActivityById,
  getAllActivity,
  postActivity,
  updateActivity,
} from "../../controllers/activity_controller";
import { verifyRole } from "../../middlewares/roles_middlewares";

const router = Router();

router.get("/activity/:id", getActivityById);
router.get("/activity/", verifyRole(["admin", "trainer"]), getAllActivity);
router.post("/acitivity/", verifyRole(["admin", "trainer"]), postActivity);
router.put("/acitivity/", verifyRole(["admin", "trainer"]), updateActivity);
router.delete(
  "/acitivity/:id",
  verifyRole(["admin", "trainer"]),
  deleteActivity
);

export default router;
