import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import { trainerFencerTabs } from "../../components/Sidebar/trainerFencerTabs";
import VerticalTabs from "../../components/VerticalTabs";

export default function TrainerViewFencers() {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    console.log("qwer")
    setTabItems(trainerFencerTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={trainerFencerTabs} />;
}
