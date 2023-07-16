import { useEffect } from "react";

import { fencerMesocycleTabs } from "../../components/Sidebar/fencerMesocycleTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

const CycleDetail = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(fencerMesocycleTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerMesocycleTabs} />;
}

export default CycleDetail 
