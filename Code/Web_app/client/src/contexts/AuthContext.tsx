import React, { createContext, useState } from "react";
import { User } from "../types";

interface AuthContext {
  user: User | null;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContext>(null!);

export const AuthProvider = ({ children }: {children: React.ReactNode}) => {
  const [ user, setUser ] = useState<User>(null!);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext;