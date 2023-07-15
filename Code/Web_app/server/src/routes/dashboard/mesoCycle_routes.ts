import { Router } from "express";

import {
  deleteMesoCycle,
  getAllMesoCycle,
  getMesoCycleById,
  getGroupMesoCyclesByFencerId,
  postMesoCycle,
  updateMesoCycle,
} from "../../controllers/mesoCycle_controller";

const router = Router();

router.get("/meso_cycle/:id", getMesoCycleById);
router.get("/meso_cycle/", getAllMesoCycle);
router.post("/meso_cycle/", postMesoCycle);
router.put("/meso_cycle/:id", updateMesoCycle);
router.delete("/meso_cycle/:id", deleteMesoCycle);
router.get("/group/meso_cycle/:id", getGroupMesoCyclesByFencerId);

export default router;
