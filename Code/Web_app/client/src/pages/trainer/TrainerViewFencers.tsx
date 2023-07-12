import { useEffect } from "react";

import { trainerFencerTabs } from "../../components/Sidebar/trainerFencerTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

export default function TrainerViewFencers() {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(trainerFencerTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={trainerFencerTabs} />;
}
