import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useState,
} from "react";
import { LoginFormInputs, SignupFormInputs, User } from "../types";
import { useNavigate } from "react-router-dom";
import axios from "../services/axios";

interface AuthContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User>>;
  login: (user: LoginFormInputs) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupFormInputs) => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  const navigate = useNavigate();

  const login = async (user: LoginFormInputs) => {
    try {
      const response = await axios.post("/auth/login", user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.removeItem("user");
      setUser(null!);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const signup = async (user: SignupFormInputs) => {
    try {
      await axios.post("/auth/signup", user);
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
