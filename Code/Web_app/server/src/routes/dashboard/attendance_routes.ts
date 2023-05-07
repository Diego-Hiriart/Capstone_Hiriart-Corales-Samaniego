import { Router } from "express";

import {
  deleteAttendance,
  getAllAttendance,
  getAttendanceById,
  postAttendance,
  updateAttendance,
} from "../../controllers/attendance_controller";

const router = Router();

router.get("/attendance/:id", getAttendanceById);
router.get("/attendance/", getAllAttendance);
router.post("/attendance/", postAttendance);
router.put("/attendance/:id", updateAttendance);
router.delete("/attendance/:id", deleteAttendance);

export default router;
