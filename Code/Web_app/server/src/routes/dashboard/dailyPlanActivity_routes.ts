import { Router } from "express";

import {
  deleteDailyPlanActivity,
  getAllDailyPlanActivity,
  getDailyPlanActivityById,
  postDailyPlanActivity,
  removeActivityFromPlan,
  updateDailyPlanActivity,
} from "../../controllers/dailyPlanActivity_controller";

const router = Router();

router.get("/daily_plan_activity/:id", getDailyPlanActivityById);
router.get("/daily_plan_activity/", getAllDailyPlanActivity);
router.post("/daily_plan_activity/", postDailyPlanActivity);
router.put("/daily_plan_activity/:id/remove_activity/", removeActivityFromPlan);
router.put("/daily_plan_activity/:id", updateDailyPlanActivity);
router.delete("/daily_plan_activity/:id", deleteDailyPlanActivity);

export default router;
