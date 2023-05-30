import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/AuthContext";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { MultiStepFormProvider } from "../contexts/MultiStepFormContext";
import axios from "../services/axios";

const SignupContextRoute = () => {
  const { user } = useContext(AuthContext);
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [queryParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .post(`/auth/registration_link/check?t=${queryParams.get("t")}`)
      .then(() => {
        setIsValidToken(true);
      })
      .catch(() => setIsValidToken(false))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return null;
  }
  if (!isValidToken) return <Navigate to="/unauthorized" replace />;
  if (user) return <Navigate to="/" replace />;
  return (
    <MultiStepFormProvider>
      <Outlet />
    </MultiStepFormProvider>
  );
};

export default SignupContextRoute;
