import { Router } from 'express';

import { trainModel } from '../controllers/ai_controller';

const router = Router();

router.post('/train-model', trainModel);

export default router;
