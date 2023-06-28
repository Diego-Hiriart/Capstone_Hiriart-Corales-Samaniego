import FencerList from "../../pages/fencer/FencerList";
import TrainerTrainingGroups from "../../pages/trainer/TrainerTrainingGroups";

export const trainerFencerTabs = [
  { label: "Listado de esgrimistas", component: <FencerList /> },
  { label: "Grupos", component: <TrainerTrainingGroups /> },
];