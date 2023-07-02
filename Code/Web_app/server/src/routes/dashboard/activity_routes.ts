import { Router } from "express";

import {
  deleteActivity,
  getActivityById,
  getAllActivity,
  postActivity,
  updateActivity,
} from "../../controllers/activity_controller";

const router = Router();

router.get("/activity/:id", getActivityById);
router.get("/activity/", getAllActivity);
router.post("/activity/", postActivity);
router.put("/activity/:id", updateActivity);
router.delete("/activity/:id", deleteActivity);

export default router;
