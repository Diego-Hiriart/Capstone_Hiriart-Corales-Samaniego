import AcademyActivities from "../../pages/academy/AcademyActivities";
import AcademyConfig from "../../pages/academy/AcademyConfig";
import AcademyMachines from "../../pages/academy/AcademyMachines";
import ActivityList from "../../pages/activity/ActivityList";

export const academyTabs = [
  { label: "Configuración", component: <AcademyConfig /> },
  { label: "Actividades", component: <AcademyActivities /> },
  { label: "Actividades del día", component: <ActivityList /> },
  { label: "Máquinas disponibles", component: <AcademyMachines /> },
];
