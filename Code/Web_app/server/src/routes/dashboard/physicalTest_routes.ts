import { Router } from "express";

import {
  deletePhysicalTest,
  getAllPhysicalTest,
  getPhysicalTestById,
  postPhysicalTest,
  updatePhysicalTest,
} from "../../controllers/physicalTest_controller";

const router = Router();

router.get("/physical_test/:id", getPhysicalTestById);
router.get("/physical_test/", getAllPhysicalTest);
router.post("/physical_test/", postPhysicalTest);
router.put("/physical_test/:id", updatePhysicalTest);
router.delete("/physical_test/:id", deletePhysicalTest);

export default router;
