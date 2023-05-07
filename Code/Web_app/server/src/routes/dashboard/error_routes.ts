import { Router } from "express";

import {
  deleteError,
  getAllError,
  getErrorById,
  postError,
  updateError,
} from "../../controllers/error_controller";

const router = Router();

router.get("/error/:id", getErrorById);
router.get("/error/", getAllError);
router.post("/error/", postError);
router.put("/error/:id", updateError);
router.delete("/error/:id", deleteError);

export default router;
