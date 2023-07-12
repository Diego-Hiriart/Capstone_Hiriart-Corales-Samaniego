import { useEffect } from "react";

import { fencerProfileTabs } from "../../components/Sidebar/fencerProfileTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

const FencerProfile = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(fencerProfileTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerProfileTabs} />;
};

export default FencerProfile;
