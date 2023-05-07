import { Router } from "express";

import { verifyRole } from "../../middlewares/roles_middlewares";

const router = Router();

router.get("/admin", verifyRole(["admin"]), () => {});

export default router;
