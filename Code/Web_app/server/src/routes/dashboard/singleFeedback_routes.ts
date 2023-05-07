import { Router } from "express";

import {
  deleteSingleFeedback,
  getAllSingleFeedback,
  getSingleFeedbackById,
  postSingleFeedback,
  updateSingleFeedback,
} from "../../controllers/singleFeedback_controller";

const router = Router();

router.get("/single_feedback/:id", getSingleFeedbackById);
router.get("/single_feedback/", getAllSingleFeedback);
router.post("/single_feedback/", postSingleFeedback);
router.put("/single_feedback/:id", updateSingleFeedback);
router.delete("/single_feedback/:id", deleteSingleFeedback);

export default router;
