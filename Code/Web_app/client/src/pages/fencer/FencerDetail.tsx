import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import VerticalTabs from "../../components/VerticalTabs";
import { fencerDetailTabs } from "../../components/Sidebar/fencerDetailTabs";

const FencerDetail = () => {
  const { setTabValue, setTabItems: setTabList } = useTab();

  useEffect(() => {
    setTabList(fencerDetailTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={fencerDetailTabs} />;
}

export default FencerDetail 