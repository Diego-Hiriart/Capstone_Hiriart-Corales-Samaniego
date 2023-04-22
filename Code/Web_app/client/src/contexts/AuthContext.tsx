import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";

interface AuthContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null!);
  const navigate = useNavigate();

  const isAuthenticated = async () => {
    try {
      const response = await axios.get("/dashboard/user/me");
      const user = response.data.user;
      if (!user) {
        setUser(null!);
        navigate("/login");
        return;
      }
      setUser(user);
      return;
    } catch (error) {
      console.error(error);
    }
  };

  const login = async (user: User) => {
    try {
      const response = await axios.post("/auth/login", user);
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      setUser(null!);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (user: User) => {
    try {
      const response = await axios.post("/auth/signup", user);
      setUser(response.data.user);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
