import { Router } from "express";

import {
  deleteCycleGoal,
  getAllCycleGoal,
  getCycleGoalByFencerIdAndCycleId,
  getCycleGoalById,
  getCycleGoalsByFencerId,
  postCycleGoal,
  updateCycleGoal,
} from "../../controllers/cycleGoal_controller";

const router = Router();

router.get("/cyclegoal_routes/:id", getCycleGoalById);
router.get("/cyclegoal_routes/", getAllCycleGoal);
router.post("/cyclegoal_routes/", postCycleGoal);
router.put("/cyclegoal_routes/:id", updateCycleGoal);
router.delete("/cyclegoal_routes/:id", deleteCycleGoal);
router.get("/fencer/cyclegoal_routes/:id", getCycleGoalsByFencerId);
router.get("/fencer/:fencerId/cyclegoal_routes/:cycleId", getCycleGoalByFencerIdAndCycleId);

export default router;
