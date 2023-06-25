import useTab from "../../hooks/useTab";
import FencerList from "../../pages/fencer/FencerList";
import TrainerTrainingGroups from "../../pages/trainer/TrainerTrainingGroups";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";

const TrainerFencerLinks = [
  { label: "Listado de esgrimistas", component: <FencerList /> },
  { label: "Grupos", component: <TrainerTrainingGroups /> },
];

export const SideBarLinks = () => {
  const { pathname } = useLocation();
  const { setTabValue } = useTab();

  let links;
  if (pathname === "/fencer") {
    links = TrainerFencerLinks;
  }

  return (
    <List>
      {links?.map((link, index) => (
        <ListItem key={link.label} disablePadding>
          <ListItemButton onClick={() => setTabValue(index)}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
