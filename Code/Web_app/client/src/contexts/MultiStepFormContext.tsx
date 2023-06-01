import { ReactNode, createContext, useState } from "react";

type FormType = Record<string, unknown>;

interface MultiStepFormContextType {
  multiFormState: FormType;
  setMultiFormState: (formState: FormType) => void;
  registrationToken: string | null;
  setRegistrationToken: (token: string | null) => void;
}

const MultiStepFormContext = createContext<MultiStepFormContextType>({
  multiFormState: {},
  setMultiFormState: () => {},
  registrationToken: null,
  setRegistrationToken: () => {},
});

export const MultiStepFormProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [multiFormState, setMultiFormState] = useState<FormType>({});
  const [registrationToken, setRegistrationToken] = useState<string | null>(
    null
  );
  return (
    <MultiStepFormContext.Provider
      value={{
        multiFormState: multiFormState,
        setMultiFormState,
        registrationToken,
        setRegistrationToken,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiStepFormContext;
