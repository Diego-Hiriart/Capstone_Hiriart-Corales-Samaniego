import CycleFeedback from "../../pages/fencer/cycle-feedbacks/CycleFeedback";
import CycleGoalItem from "../../pages/fencer/goals/CycleGoalitem";
import MesoCycleDetails from "../../pages/mesocycle/MesoCycleDetails";

export const fencerMesocycleTabs = [
  { label: "Planificación", component: <MesoCycleDetails /> },
  { label: "Objetivo", component: <CycleGoalItem /> },
  { label: "Feedback", component: <CycleFeedback /> },
];
