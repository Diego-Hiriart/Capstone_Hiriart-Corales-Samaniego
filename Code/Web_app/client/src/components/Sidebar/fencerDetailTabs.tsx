import FencerAITrainings from "../../pages/fencer/FencerAITrainings";
import FencerFeedback from "../../pages/fencer/FencerFeedback";
import FencerInfo from "../../pages/fencer/FencerInfo";
import FencerGoals from "../../pages/fencer/goals/FencerGoals";

export const fencerDetailTabs = [
  { label: "Feedback", component: <FencerFeedback /> },
  { label: "Entrenamientos IA", component: <FencerAITrainings /> },
  { label: "Información de usuario", component: <FencerInfo /> },
  { label: "Objetivos", component: <FencerGoals /> },
];
