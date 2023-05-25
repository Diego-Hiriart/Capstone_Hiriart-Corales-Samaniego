import express from 'express';

import ai_routes from './ai_routes';

const router = express.Router();

router.use('/ai-analysis', ai_routes); // Login, singup, etc

export default router;
