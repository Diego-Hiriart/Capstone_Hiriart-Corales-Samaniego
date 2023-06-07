import { Router } from 'express';

import { poseAnalysis } from '../controllers/ai_controller';

const router = Router();

router.post('/analize-poses', poseAnalysis);

export default router;
