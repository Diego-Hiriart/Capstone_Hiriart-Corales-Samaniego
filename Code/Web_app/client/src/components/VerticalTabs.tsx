import { useEffect } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import useTab from "../hooks/useTab";
import { TabPanel } from "./TabPanel";
import { TabItem } from "../types";

interface Props {
  tabItems: TabItem[];
}

const VerticalTabs = ({ tabItems }: Props) => {
  const { tabValue, setTabValue } = useTab();

  useEffect(() => {
    setTabValue(0);
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        value={tabValue}
        onChange={(e, value) => setTabValue(value)}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider", display: {xs: "none", sm: "block"}}} // TODO: add fixed position to sidebar
      >
        {tabItems.map((tabItem, index) => (
          <Tab
            key={tabItem.label}
            label={tabItem.label}
            {...a11yProps(index)}
          />
        ))}
      </Tabs>
      {tabItems.map((tabItem, index) => (
        <TabPanel
          key={`tabPanel-${tabItem.label}`}
          value={tabValue}
          index={index}
        >
          {tabItem.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default VerticalTabs;