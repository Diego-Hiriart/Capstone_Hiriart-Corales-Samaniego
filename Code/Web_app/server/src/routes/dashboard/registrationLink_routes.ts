import { Router } from "express";

import {
  deleteRegistrationLink,
  getAllRegistrationLink,
  getRegistrationLinkByEmail,
  getRegistrationLinkByToken,
  postGenerateLink,
  postRegistrationLink,
  updateRegistrationLink,
} from "../../controllers/registrationLink_controller";

const router = Router();

router.get("/registration_link/token", getRegistrationLinkByToken);
router.get("/registration_link/:email", getRegistrationLinkByEmail);
router.get("/registration_link/", getAllRegistrationLink);
router.post("/registration_link/generate", postGenerateLink);
router.post("/registration_link/", postRegistrationLink);
router.put("/registration_link/:id", updateRegistrationLink);
router.delete("/registration_link/:id", deleteRegistrationLink);

export default router;
