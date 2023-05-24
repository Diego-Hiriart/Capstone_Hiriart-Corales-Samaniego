import { Router } from 'express';

import { poseAnalysis, trainModel } from '../controllers/ai_controller';

const router = Router();

router.post('/analize-poses', poseAnalysis);
router.post('/train-model', trainModel);

export default router;
