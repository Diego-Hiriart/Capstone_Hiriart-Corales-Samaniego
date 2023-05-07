import { Router } from "express";

import {
  deleteTrainingError,
  getAllTrainingError,
  getTrainingErrorById,
  postTrainingError,
  updateTrainingError,
} from "../../controllers/trainingError_controller";

const router = Router();

router.get("/training_error/:id", getTrainingErrorById);
router.get("/training_error/", getAllTrainingError);
router.post("/training_error/", postTrainingError);
router.put("/training_error/:id", updateTrainingError);
router.delete("/training_error/:id", deleteTrainingError);

export default router;
