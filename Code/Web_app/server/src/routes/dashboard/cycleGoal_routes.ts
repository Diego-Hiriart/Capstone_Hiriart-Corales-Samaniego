import { Router } from "express";

import {
  deleteCycleGoal,
  getAllCycleGoal,
  getCycleGoalById,
  postCycleGoal,
  updateCycleGoal,
} from "../../controllers/cycleGoal_controller";

const router = Router();

router.get("/cyclegoal_routes/:id", getCycleGoalById);
router.get("/cyclegoal_routes/", getAllCycleGoal);
router.post("/cyclegoal_routes/", postCycleGoal);
router.put("/cyclegoal_routes/:id", updateCycleGoal);
router.delete("/cyclegoal_routes/:id", deleteCycleGoal);

export default router;
