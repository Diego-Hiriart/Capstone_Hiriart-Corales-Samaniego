import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import { Box, Tab, Tabs } from "@mui/material";
import { TabPanel, a11yProps } from "../../components/TabPanel";
import FencerFeedback from "./FencerFeedback";
import FencerAITrainings from "./FencerAITrainings";

const FencerDetail = () => {
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
        <Tab label="Feedback" {...a11yProps(0)} />
        <Tab label="Entrenamientos IA" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <FencerFeedback /> 
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <FencerAITrainings />
      </TabPanel>
    </Box>
  )
}

export default FencerDetail 