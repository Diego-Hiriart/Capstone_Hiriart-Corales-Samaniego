import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import FencerList from "../fencer/FencerList";
import TrainerTrainingGroups from "./TrainerTrainingGroups";
import { useEffect } from "react";
import useTab from "../../hooks/useTab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      css={{ width: "100%" }}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

export default function TrainerViewFencers() {
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
        height: 224,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabValue}
        onChange={(e, value) => setTabValue(value)}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Listado de esgrimistas" {...a11yProps(0)} />
        <Tab label="Grupos" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <FencerList />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TrainerTrainingGroups />
      </TabPanel>
    </Box>
  );
}
