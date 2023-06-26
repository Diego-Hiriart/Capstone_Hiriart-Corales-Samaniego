import { ReactNode, createContext, useState } from "react";
import { TabItem } from "../types";
interface TabContext {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
  tabItems: (TabItem[] | null);
  setTabItems: React.Dispatch<React.SetStateAction<TabItem[] | null>>;
}

const TabContext = createContext<TabContext>({
  tabValue: 0,
  setTabValue: () => {},
  tabItems: [],
  setTabItems: () => {},
});

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabValue, setTabValue] = useState<number>(0);
  const [tabItems, setTabItems] = useState<TabItem[] | null>(null);

  return (
    <TabContext.Provider
      value={{
        tabValue,
        setTabValue,
        tabItems,
        setTabItems,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export default TabContext;
