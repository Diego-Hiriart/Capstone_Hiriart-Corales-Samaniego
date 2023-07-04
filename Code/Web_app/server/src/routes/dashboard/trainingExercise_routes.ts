import { Router } from "express";
import {
  deleteTrainingExercise,
  getAllTrainingExercises,
  postTrainingExercise,
} from "../../controllers/trainingExercise_controller";

const router = Router();

router.get("/training-exercises/", getAllTrainingExercises);
router.post("/training-exercises/", postTrainingExercise);
router.delete("/training-exercises/:id", deleteTrainingExercise);

export default router;
