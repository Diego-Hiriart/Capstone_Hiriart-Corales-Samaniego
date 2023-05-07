import { Router } from "express";

import {
  deleteMicroCycle,
  getAllMicroCycle,
  getMicroCycleById,
  postMicroCycle,
  updateMicroCycle,
} from "../../controllers/microCycle_controller";

const router = Router();

router.get("/micro_cycle/:id", getMicroCycleById);
router.get("/micro_cycle/", getAllMicroCycle);
router.post("/micro_cycle/", postMicroCycle);
router.put("/micro_cycle/:id", updateMicroCycle);
router.delete("/micro_cycle/:id", deleteMicroCycle);

export default router;
