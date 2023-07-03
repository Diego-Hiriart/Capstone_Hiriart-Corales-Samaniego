import { Router } from "express";

import {
  deleteConfig,
  getAllConfig,
  getConfigById,
  postConfig,
  updateConfig,
} from "../../controllers/academyConfig_controller";

const router = Router();

router.get("/config/:id", getConfigById);
router.get("/config/", getAllConfig);
router.post("/config/", postConfig);
router.put("/config/:id", updateConfig);
router.delete("/config/:id", deleteConfig);

export default router;
