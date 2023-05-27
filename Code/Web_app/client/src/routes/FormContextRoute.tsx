import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { MultiStepFormProvider } from "../contexts/MultiStepFormContext";

const SignupContextRoute = () => {
  const { user } = useContext(AuthContext);
  if (user) return <Navigate to="/" replace />;
  return (
    <MultiStepFormProvider>
      <Outlet />
    </MultiStepFormProvider>
  );
};

export default SignupContextRoute;
