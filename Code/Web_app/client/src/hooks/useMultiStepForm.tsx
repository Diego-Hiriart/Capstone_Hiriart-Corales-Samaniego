import { useContext } from "react";
import MultiStepFormContext from "../contexts/MultiStepFormContext";

const useMultiStepForm = () => {
  const context = useContext(MultiStepFormContext);
  if (!context) throw new Error("useMultiStepForm must be used within a MultiStepFormProvider");
  return context;
}

export default useMultiStepForm