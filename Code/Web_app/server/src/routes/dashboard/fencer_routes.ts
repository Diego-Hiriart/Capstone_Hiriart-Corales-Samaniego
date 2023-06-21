import { Router } from "express";

import {
  deleteFencerFromGruop,
  getAllFencer,
  getFencerById,
  postFencer,
  updateFencer,
  updateFencerToGroup,
} from "../../controllers/fencer_controller";

const router = Router();

router.get("/fencer/:id", getFencerById);
router.get("/fencer/", getAllFencer);
router.post("/fencer/", postFencer);
router.put("/fencer/group/:id", deleteFencerFromGruop);
router.put("/fencer/:id", updateFencer);
router.put("/fencer/", updateFencerToGroup);

export default router;
