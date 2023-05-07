import { Router } from "express";

import {
  deleteAITraining,
  getAITrainingById,
  getAllAITraining,
  postAITraining,
  updateAITraining,
} from "../../controllers/aiTraining_controller";

const router = Router();

router.get("/aitraining/:id", getAITrainingById);
router.get("/aitraining/", getAllAITraining);
router.post("/aitraining/", postAITraining);
router.put("/aitraining/:id", updateAITraining);
router.delete("/aitraining/:id", deleteAITraining);

export default router;
