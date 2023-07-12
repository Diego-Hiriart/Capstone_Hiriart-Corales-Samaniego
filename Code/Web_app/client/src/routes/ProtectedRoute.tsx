import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import AuthContext from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, checkToken } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkToken().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return null;
  }
  return allowedRoles.some((role) => user?.roles.includes(role)) ? (
    <Outlet />
  ) : user ? (
    <Navigate to="/unauthorized" />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
