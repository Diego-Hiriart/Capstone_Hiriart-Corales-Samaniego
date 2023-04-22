import { Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Login from "./pages/Login";
import "dayjs/locale/es";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

export const App = () => (
  <div>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="signup" element={<Signup />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<h1>Not found</h1>} />
    </Routes>
  </div>
);
