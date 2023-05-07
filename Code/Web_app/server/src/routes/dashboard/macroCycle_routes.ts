import { Router } from "express";

import {
  deleteMacroCycle,
  getAllMacroCycle,
  getMacroCycleById,
  postMacroCycle,
  updateMacroCycle,
} from "../../controllers/macroCycle_controller";

const router = Router();

router.get("/macro_cycle/:id", getMacroCycleById);
router.get("/macro_cycle/", getAllMacroCycle);
router.post("/macro_cycle/", postMacroCycle);
router.put("/macro_cycle/:id", updateMacroCycle);
router.delete("/macro_cycle/:id", deleteMacroCycle);

export default router;
