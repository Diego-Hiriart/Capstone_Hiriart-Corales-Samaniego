import { Router } from "express";

import {
  getAllTrainer,
  getTrainerById,
  postTrainer,
  updateTrainer,
} from "../../controllers/trainer_controller";

const router = Router();

router.get("/trainer/:id", getTrainerById);
router.get("/trainer/", getAllTrainer);
router.post("/trainer/", postTrainer);
router.put("/trainer/:id", updateTrainer);

export default router;
