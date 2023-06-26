import { ReactNode, createContext, useState } from "react";
import { TabItem } from "../types";
interface TabContext {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  tabItems: TabItem[];
  setTabItems: React.Dispatch<React.SetStateAction<TabItem[]>>;
}

const TabContext = createContext<TabContext>({
  tabValue: 0,
  setTabValue: () => {},
  tabItems: [],
  setTabItems: () => {},
});

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [tabList, setTabList] = useState<TabItem[]>([]);

  return (
    <TabContext.Provider
      value={{
        tabValue,
        setTabValue,
        tabItems: tabList,
        setTabItems: setTabList,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export default TabContext;
