import { Router } from "express";

import { poseAnalysis } from "../../controllers/ai_analysis_controller";

const router = Router();

router.post("/analyze-poses", poseAnalysis);

export default router;
