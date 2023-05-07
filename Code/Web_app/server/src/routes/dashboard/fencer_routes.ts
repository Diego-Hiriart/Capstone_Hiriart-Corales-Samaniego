import { Router } from "express";

import {
  getAllFencer,
  getFencerById,
  postFencer,
  updateFencer,
} from "../../controllers/fencer_controller";

const router = Router();

router.get("/fencer/:id", getFencerById);
router.get("/fencer/", getAllFencer);
router.post("/fencer/", postFencer);
router.put("/fencer/:id", updateFencer);

export default router;
