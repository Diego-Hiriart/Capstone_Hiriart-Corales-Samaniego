import { AxiosError } from "axios";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { SignupFormType } from "../pages/fencer/validations/SignupFormValidation";
import axios from "../services/axios";
import { LoginFormInputs, User } from "../types";

interface AuthContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  login: (user: LoginFormInputs) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupFormType) => Promise<void>;
  checkToken: () => Promise<void>;
}

//TODO: create a custom hook to use this context
const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  checkToken: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    return parsedUser ? parsedUser : null;
  });

  const navigate = useNavigate();

  const login = async (user: LoginFormInputs) => {
    const response = await axios.post("/auth/login", user);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    setUser(response.data.user);
    navigate("/");
  };

  const logout = async () => {
    try {
      localStorage.removeItem("user");
      setUser(null!);
      await axios.post("/auth/logout");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (user: SignupFormType) => {
    await axios.post("/auth/signup", user);
    navigate("/login");
  };

  const checkToken = async () => {
    try {
      //validate token and get user
      const { data } = await axios.get("/dashboard/user/me");
      const user = data.data as User;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          setUser(null!);
        }
      }
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, signup, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
