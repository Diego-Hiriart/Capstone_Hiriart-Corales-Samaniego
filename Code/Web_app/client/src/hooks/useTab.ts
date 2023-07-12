import { useContext } from "react";

import TabContext from "../contexts/TabContext";

const useTab = () => {
  return useContext(TabContext);
};

export default useTab;
