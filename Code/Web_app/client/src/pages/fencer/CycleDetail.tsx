import { useEffect } from "react";

import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";
import { fencerMesocycleTabs } from "../../components/Sidebar/fencerMesocycleTabs";

const CycleDetail = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(fencerMesocycleTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerMesocycleTabs} />;
}

export default CycleDetail 
