import { useEffect } from "react";

import { fencerDetailTabs } from "../../components/Sidebar/fencerDetailTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

const FencerDetail = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(fencerDetailTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerDetailTabs} />;
}

export default FencerDetail 
