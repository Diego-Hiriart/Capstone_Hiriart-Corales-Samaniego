import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import { trainerFencerTabs } from "../../components/Sidebar/trainerFencerTabs";
import VerticalTabs from "../../components/VerticalTabs";

export default function TrainerViewFencers() {
  const { setTabValue, setTabItems: setTabList } = useTab();

  useEffect(() => {
    setTabList(trainerFencerTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={trainerFencerTabs} />;
}
