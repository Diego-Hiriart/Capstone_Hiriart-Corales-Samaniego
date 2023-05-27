import { ReactNode, createContext, useState } from "react";

type FormType = Record<string, unknown>;

interface MultiStepFormContextType {
  formState: FormType;
  setFormState: (formState: FormType) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextType>({
  formState: {},
  setFormState: () => {},
});

export const MultiStepFormProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<FormType>({});
  return (
    <MultiStepFormContext.Provider value={{ formState, setFormState }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiStepFormContext;
