import { Router } from "express";

import {
  deleteRegistrationLink,
  getAllRegistrationLink,
  getRegistrationLinkById,
  postRegistrationLink,
  updateRegistrationLink,
} from "../../controllers/registrationLink_controller";

const router = Router();

router.get("/registration_link");

router.get("/registration_link/:id", getRegistrationLinkById);
router.get("/registration_link/", getAllRegistrationLink);
router.post("/registration_link/", postRegistrationLink);
router.put("/registration_link/:id", updateRegistrationLink);
router.delete("/registration_link/:id", deleteRegistrationLink);

export default router;
