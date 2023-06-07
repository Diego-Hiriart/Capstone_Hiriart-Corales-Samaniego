import { Router } from "express";

import {
  deleteSingleFeedback,
  getAllSingleFeedback,
  getSingleFeedbackById,
  getSingleFeedbacksByFencerId,
  postSingleFeedback,
  updateSingleFeedback,
} from "../../controllers/singleFeedback_controller";

const router = Router();

router.get("/single_feedback/:id", getSingleFeedbackById);
router.get("/single_feedback/", getAllSingleFeedback);
router.post("/single_feedback/", postSingleFeedback);
router.put("/single_feedback/:id", updateSingleFeedback);
router.delete("/single_feedback/:id", deleteSingleFeedback);
router.get("/fencer_single_feedback/:id", getSingleFeedbacksByFencerId);

export default router;
