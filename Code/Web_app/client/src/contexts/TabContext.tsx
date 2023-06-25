import { ReactNode, createContext, useState } from "react";

interface TabContext {
  tabValue: number;
  setTabValue: React.Dispatch<React.SetStateAction<number>>;
}

const TabContext = createContext<TabContext>({
  tabValue: 0,
  setTabValue: () => {},
});

export const TabProvider = ({ children }: { children: ReactNode }) => {
  const [tabValue, setTabValue] = useState<number>(0);

  return (
    <TabContext.Provider value={{ tabValue, setTabValue }}>
      {children}
    </TabContext.Provider>
  );
};

export default TabContext;
