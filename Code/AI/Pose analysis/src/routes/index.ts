import express from 'express';

import ai_routes from './ai_routes';

const router = express.Router();

router.use('/ai-analysis', ai_routes); //Separated by functionality

export default router;
