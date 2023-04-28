import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import "dayjs/locale/es";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useContext } from "react";
import AuthContext from "./contexts/AuthContext";

export const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="signup"
          element={user ? <Navigate to="/" replace /> : <Signup />}
        />
        <Route
          path="login"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
};
