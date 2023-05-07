import { Router } from "express";

import {
  deleteActivityType,
  getActivityTypeById,
  getAllActivityType,
  postActivityType,
  updateActivityType,
} from "../../controllers/activityType_controller";

const router = Router();

router.get("/activity_type/:id", getActivityTypeById);
router.get("/activity_type/", getAllActivityType);
router.post("/activity_type/", postActivityType);
router.put("/activity_type/:id", updateActivityType);
router.delete("/activity_type/:id", deleteActivityType);

export default router;
