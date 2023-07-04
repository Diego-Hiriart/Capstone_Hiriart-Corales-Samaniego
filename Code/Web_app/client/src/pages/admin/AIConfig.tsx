import { useEffect } from "react";
import useTab from "../../hooks/useTab";
import VerticalTabs from "../../components/VerticalTabs";
import { aiConfigTabs } from "../../components/Sidebar/AIConfigTabs";

const AIConfig = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(aiConfigTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={aiConfigTabs} />;
}

export default AIConfig 