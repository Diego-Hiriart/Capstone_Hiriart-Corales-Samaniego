import { Router } from "express";

import {
  deleteCycleFeedback,
  getAllCycleFeedback,
  getCycleFeedbackByFencerIdAndCycleId,
  getCycleFeedbackById,
  getCycleFeedbacksByFencerId,
  postCycleFeedback,
  updateCycleFeedback,
} from "../../controllers/cycleFeedback_controller";

const router = Router();

router.get("/cycle_feedback/:id", getCycleFeedbackById);
router.get("/cycle_feedback/", getAllCycleFeedback);
router.post("/cycle_feedback/", postCycleFeedback);
router.put("/cycle_feedback/:id", updateCycleFeedback);
router.delete("/cycle_feedback/:id", deleteCycleFeedback);
router.get("/fencer/cycle_feedback/:id", getCycleFeedbacksByFencerId);
router.get("/fencer/:fencerId/cycle_feedback/:cycleId", getCycleFeedbackByFencerIdAndCycleId);

export default router;
