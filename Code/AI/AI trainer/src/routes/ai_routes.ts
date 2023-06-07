import { Router } from 'express';

import { trainModel, saveModel } from '../controllers/ai_controller';

const router = Router();

router.post('/train-model', trainModel);
router.post('/save-model', saveModel);

export default router;
