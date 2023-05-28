import { ReactNode, createContext, useState } from "react";

type FormType = Record<string, unknown>;

interface MultiStepFormContextType {
  multiFormState: FormType;
  setMultiFormState: (formState: FormType) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextType>({
  multiFormState: {},
  setMultiFormState: () => {},
});

export const MultiStepFormProvider = ({ children }: { children: ReactNode }) => {
  const [multiFormState, setMultiFormState] = useState<FormType>({});
  return (
    <MultiStepFormContext.Provider value={{ multiFormState: multiFormState, setMultiFormState }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiStepFormContext;
