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
router.post("/acitivity/", postActivity);
router.put("/acitivity/:id", updateActivity);
router.delete("/acitivity/:id", deleteActivity);

export default router;
