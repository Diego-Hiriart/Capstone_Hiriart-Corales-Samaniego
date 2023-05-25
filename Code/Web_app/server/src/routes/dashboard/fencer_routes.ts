import { Router } from "express";

import {
  getAllFencer,
  getFencerById,
  getFencerByName,
  postFencer,
  updateFencer,
  updateFencerToGroup,
} from "../../controllers/fencer_controller";

const router = Router();

router.get("/fencer/:id", getFencerById);
router.get("/fencer/search/:names", getFencerByName);
router.get("/fencer/", getAllFencer);
router.post("/fencer/", postFencer);
router.put("/fencer/:id", updateFencer);
router.put("/fencer/", updateFencerToGroup);

export default router;
