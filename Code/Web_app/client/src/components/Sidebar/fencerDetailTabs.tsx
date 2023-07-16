import FencerAITrainings from "../../pages/fencer/FencerAITrainings";
import FencerFeedback from "../../pages/fencer/FencerFeedback";
import FencerInfo from "../../pages/fencer/FencerInfo";
import CycleFeedbacks from "../../pages/fencer/cycle-feedbacks/CycleFeedbacks";
import FencerGoals from "../../pages/fencer/goals/FencerGoals";

export const fencerDetailTabs = [
  { label: "Feedback", component: <FencerFeedback /> },
  { label: "Feedbacks de mesociclo", component: <CycleFeedbacks /> },
  { label: "Objetivos", component: <FencerGoals /> },
  { label: "Entrenamientos IA", component: <FencerAITrainings /> },
  { label: "Información de usuario", component: <FencerInfo /> },
];
