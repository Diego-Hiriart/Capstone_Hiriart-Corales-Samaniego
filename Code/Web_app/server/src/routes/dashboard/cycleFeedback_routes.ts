import { Router } from "express";

import {
  deleteCycleFeedback,
  getAllCycleFeedback,
  getCycleFeedbackById,
  postCycleFeedback,
  updateCycleFeedback,
} from "../../controllers/cycleFeedback_controller";

const router = Router();

router.get("/cycle_feedback/:id", getCycleFeedbackById);
router.get("/cycle_feedback/", getAllCycleFeedback);
router.post("/cycle_feedback/", postCycleFeedback);
router.put("/cycle_feedback/:id", updateCycleFeedback);
router.delete("/cycle_feedback/:id", deleteCycleFeedback);

export default router;
