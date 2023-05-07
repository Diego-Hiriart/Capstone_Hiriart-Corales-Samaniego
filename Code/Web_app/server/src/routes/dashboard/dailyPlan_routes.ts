import { Router } from "express";

import {
  deleteDailyPlan,
  getAllDailyPlan,
  getDailyPlanById,
  postDailyPlan,
  updateDailyPlan,
} from "../../controllers/dailyPlan_controller";

const router = Router();

router.get("/daily_plan/:id", getDailyPlanById);
router.get("/daily_plan/", getAllDailyPlan);
router.post("/daily_plan/", postDailyPlan);
router.put("/daily_plan/:id", updateDailyPlan);
router.delete("/daily_plan/:id", deleteDailyPlan);

export default router;
