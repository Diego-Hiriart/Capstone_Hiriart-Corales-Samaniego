import { Router } from "express";

import {
  deleteTrainingCombat,
  getAllTrainingCombat,
  getTrainingCombatById,
  postTrainingCombat,
  updateTrainingCombat,
} from "../../controllers/trainingCombat_controller";

const router = Router();

router.get("/training_combat/:id", getTrainingCombatById);
router.get("/training_combat/", getAllTrainingCombat);
router.post("/training_combat/", postTrainingCombat);
router.put("/training_combat/:id", updateTrainingCombat);
router.delete("/training_combat/:id", deleteTrainingCombat);

export default router;
