import FencerList from "../../pages/fencer/FencerList";
import TrainerTrainingGroups from "../../pages/trainer/TrainerTrainingGroups";

export const TrainerFencerTabs = [
  { label: "Listado de esgrimistas", component: <FencerList /> },
  { label: "Grupos", component: <TrainerTrainingGroups /> },
];