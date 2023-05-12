import { ReactNode, createContext, useState } from "react";

type AlertType = {
  severity: "success" | "info" | "warning" | "error";
  message: string;
};

export type AlertContextType = {
  alert: AlertType | null;
  setAlert: (alert: AlertType | null) => void;
};

const AlertContext = createContext<AlertContextType>({
  alert: null,
  setAlert: () => {},
});

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertType | null>(null);

  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
