import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import VerticalTabs from "../../components/VerticalTabs";
import useAuth from "../../hooks/useAuth";
import {
  fencerGroupTabs,
  trainerGroupTabs,
} from "../../components/Sidebar/groupTabs";

const GroupDetails = () => {
  // TODO: Fetch group data and store in context or sm
  const { setTabValue, setTabItems: setTabList } = useTab();
  const { user } = useAuth();

  const groupDetailTabs = user?.roles?.includes("fencer")
    ? fencerGroupTabs
    : trainerGroupTabs;

  useEffect(() => {
    setTabList(groupDetailTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={groupDetailTabs} />;
};

export default GroupDetails;
