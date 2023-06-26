import useTab from "../../hooks/useTab";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useLocation } from "react-router-dom";
import { TrainerFencerTabs } from "../Sidebar/trainerFencerTabs";
import { FencerDetailTabs } from "../Sidebar/fencerDetailTabs";

export const SideBarLinks = () => {
  const { pathname } = useLocation();
  const { setTabValue } = useTab();

  let links;
  if (/^\/fencer$/.test(pathname)) {
    links = TrainerFencerTabs;
  } else if (/^\/fencer\/\d+$/.test(pathname)) {
    links = FencerDetailTabs; 
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
