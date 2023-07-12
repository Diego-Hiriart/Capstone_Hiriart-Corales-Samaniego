import { useContext } from "react";

import AlertContext from "../contexts/AlertContext";

export const useAlert = () => {
  const { alert, setAlert } = useContext(AlertContext);

  const showError = (message: string) => {
    setAlert({ message, severity: "error" });
  };

  const showSuccess = (message: string) => {
    setAlert({ message, severity: "success" });
  };

  const showInfo = (message: string) => {
    setAlert({ message, severity: "info" });
  };

  const showWarning = (message: string) => {
    setAlert({ message, severity: "warning" });
  };

  return { alert, setAlert, showError, showSuccess, showInfo, showWarning };
};
