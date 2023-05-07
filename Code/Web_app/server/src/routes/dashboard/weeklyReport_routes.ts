import { Router } from "express";

import {
  deleteWeeklyReport,
  getAllWeeklyReport,
  getWeeklyReportById,
  postWeeklyReport,
  updateWeeklyReport,
} from "../../controllers/weeklyReport_controller";

const router = Router();

router.get("/weekly_report/:id", getWeeklyReportById);
router.get("/weekly_report/", getAllWeeklyReport);
router.post("/weekly_report/", postWeeklyReport);
router.put("/weekly_report/:id", updateWeeklyReport);
router.delete("/weekly_report/:id", deleteWeeklyReport);

export default router;
