import express from 'express';

import ai_routes from './ai_routes';

const router = express.Router();

router.use('/ai-trainer', ai_routes); // Separate by functions

export default router;
