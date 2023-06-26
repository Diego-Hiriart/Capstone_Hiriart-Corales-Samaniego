import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import { fencerProfileTabs } from "../../components/Sidebar/fencerProfileTabs";
import VerticalTabs from "../../components/VerticalTabs";

const FencerProfile = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(fencerProfileTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerProfileTabs} />;
};

export default FencerProfile;
