import { Router } from "express";

import {
  deleteMachineCombatData,
  getAllMachineCombatData,
  getMachineCombatDataByName,
  postMachineCombatData,
  updateMachineCombatData,
} from "../../controllers/machineCombatData_controller";

const router = Router();

router.get("/machine_combat_data/:name", getMachineCombatDataByName);
router.get("/machine_combat_data/", getAllMachineCombatData);
router.post("/machine_combat_data/", postMachineCombatData);
router.put("/machine_combat_data/:id", updateMachineCombatData);
router.delete("/machine_combat_data/:id", deleteMachineCombatData);

export default router;
