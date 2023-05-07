import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import "dayjs/locale/es";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { useContext } from "react";
import AuthContext from "./contexts/AuthContext";
import Snackbar from "./components/Snackbar";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminHome from "./pages/admin/AdminHome";
import StudentHome from "./pages/student/StudentHome";
import TrainerHome from "./pages/trainer/TrainerHome";
import Trainers from "./pages/admin/Trainers";
import CreateTrainer from "./pages/admin/CreateTrainer";
import { Toolbar } from "@mui/material";

export const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <Snackbar />
      <Toolbar /> {/* <--- This is to avoid the content to be hidden by the navbar */}
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
        <Route element={<ProtectedRoute allowedRoles={["admin"]}/>}>
          <Route path="admin" element={<AdminHome />} />
          <Route path="trainers" element={<Trainers />}/>
          <Route path="trainers/create" element={<CreateTrainer />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["trainer"]}/>}>
          <Route path="trainer" element={<TrainerHome />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["student"]}/>}>
          <Route path="student" element={<StudentHome />} />
        </Route>
        <Route 
          path="unauthorized" 
          element={<Unauthorized />}
        />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
};
