import { Router } from "express";

import {
  getAdminById,
  getAllAdmin,
  postAdmin,
  updateAdmin,
} from "../../controllers/admin_controller";
import { verifyRole } from "../../middlewares/roles_middlewares";

const router = Router();

router.get("/admin/:id", getAdminById);
router.get("/admin/", getAllAdmin);
router.post("/admin/", verifyRole(["admin"]), postAdmin);
router.put("/admin/:id", verifyRole(["admin"]), updateAdmin);

export default router;
