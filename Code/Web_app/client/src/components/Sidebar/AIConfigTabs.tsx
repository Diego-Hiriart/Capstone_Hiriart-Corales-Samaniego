import MoveErrorList from "../../pages/admin/MoveErrorList";
import TrainingExerciseList from "../../pages/admin/TrainingExerciseList";

export const aiConfigTabs = [
  { label: "Errores", component: <MoveErrorList />},
  { label: "Ejercicios", component: <TrainingExerciseList /> },
];
