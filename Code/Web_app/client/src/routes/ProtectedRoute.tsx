import { useContext, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import axios from "../services/axios";

const ProtectedRoute = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    //check if token is valid and set user
    //TODO: move to AuthContext
    const checkToken = async () => {
      try {
        const response = await axios.get("/dashboard/user/me");
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        return;
      } catch (error) {
        console.error(error);
        navigate("/");
        return;
      }
    };
    checkToken();
  }, []);

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
