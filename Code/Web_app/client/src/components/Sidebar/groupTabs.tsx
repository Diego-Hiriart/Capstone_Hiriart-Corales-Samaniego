import FencerGroupList from "../../pages/fencer/groups/FencerGroupList";
import FencerGroupMesoCycle from "../../pages/fencer/groups/FencerGroupMesoCycle";
import GroupFencersList from "../../pages/group/GroupFencersList";
import GroupMesoCycle from "../../pages/group/GroupMesoCycle";

export const trainerGroupTabs = [
  { label: "Integrantes", component: <GroupFencersList /> },
  { label: "Meso-ciclo", component: <GroupMesoCycle /> },
];
export const fencerGroupTabs = [
  { label: "Integrantes", component: <FencerGroupList /> },
  { label: "Meso-ciclo", component: <FencerGroupMesoCycle /> },
];
