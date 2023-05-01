import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import axios from "../services/axios";
import { User } from "../types";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, setUser } = useContext(AuthContext);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    //TODO: move to AuthContext
    const checkToken = async () => {
      try {
        //validate token and get user
        const { data } = await axios.get("/dashboard/user/me");
        const user = data.data as User;
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        const roles = user.roles;
        if(allowedRoles.some((role) => roles.includes(role))) {
          setIsAllowed(true);
        }
      } catch (error) {
        //if token is invalid, navigate to unauthorized page
        console.error(error);
        setIsAllowed(false);
      }
    };
    checkToken().finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <h1>Loading...</h1>;
  return isAllowed ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
