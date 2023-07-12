import { useEffect } from "react";

import { academyTabs } from "../../components/Sidebar/academyTabs";
import VerticalTabs from "../../components/VerticalTabs";
import useTab from "../../hooks/useTab";

const AcademyOptions = () => {
  const { setTabValue, setTabItems } = useTab();

  useEffect(() => {
    setTabItems(academyTabs);
    setTabValue(0);
  }, []);

  return <VerticalTabs tabItems={academyTabs} />;
};

export default AcademyOptions;
