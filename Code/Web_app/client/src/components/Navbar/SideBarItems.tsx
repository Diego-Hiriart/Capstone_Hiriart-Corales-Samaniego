import useTab from "../../hooks/useTab";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { TabItem } from "../../types";

export const SideBarItems = ({ items }: { items: TabItem[] }) => {
  const { setTabValue } = useTab();

  return (
    <List>
      {items?.map((item, index) => (
        <ListItem key={item.label} disablePadding>
          <ListItemButton onClick={() => setTabValue(index)}>
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};
