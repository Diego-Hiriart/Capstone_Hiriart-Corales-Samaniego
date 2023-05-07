import { Router } from "express";

import {
  deleteTrainingGroup,
  getAllTrainingGroup,
  getTrainingGroupById,
  postTrainingGroup,
  updateTrainingGroup,
} from "../../controllers/trainingGroup_controller";

const router = Router();

router.get("/training_group/:id", getTrainingGroupById);
router.get("/training_group/", getAllTrainingGroup);
router.post("/training_group/", postTrainingGroup);
router.put("/training_group/:id", updateTrainingGroup);
router.delete("/training_group/:id", deleteTrainingGroup);

export default router;
