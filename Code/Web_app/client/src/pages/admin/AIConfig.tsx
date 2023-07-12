import { useEffect } from "react";

import { aiConfigTabs } from "../../components/Sidebar/AIConfigTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

const AIConfig = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(aiConfigTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={aiConfigTabs} />;
}

export default AIConfig 
