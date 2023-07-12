import { useEffect } from "react";

import {
  fencerGroupTabs,
  trainerGroupTabs,
} from "../../components/Sidebar/groupTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useAuth from "../../hooks/useAuth";
import useTab from "../../hooks/useTab";

const GroupDetails = () => {
  // TODO: Fetch group data and store in context or sm
  const { setTabValue, setTabItems } = useTab();
  const { user } = useAuth();

  const groupDetailTabs = user?.roles?.includes("fencer")
    ? fencerGroupTabs
    : trainerGroupTabs;

  useEffect(() => {
    setTabItems(groupDetailTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={groupDetailTabs} />;
};

export default GroupDetails;
