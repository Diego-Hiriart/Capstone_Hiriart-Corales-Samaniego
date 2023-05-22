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
import FencerHome from "./pages/fencer/FencerHome";
import TrainerHome from "./pages/trainer/TrainerHome";
import CreateTrainer from "./pages/trainer/TrainerCreate";
import { Toolbar } from "@mui/material";
import TrainerList from "./pages/trainer/TrainerList";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import FencerList from "./pages/fencer/FencerList";
import TrainerTrainingGroups from "./pages/trainer/TrainerTrainingGroups";

export const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <Snackbar />
      <Toolbar />
      {/* ^--- This is to avoid the content to be hidden by the navbar */}
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
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="admin" element={<AdminHome />} />
          <Route path="trainer" element={<TrainerList />} />
          <Route path="trainer/create" element={<CreateTrainer />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin", "trainer"]} />}>
          <Route path="trainer/:id" element={<TrainerProfile />} />
          <Route path="fencer" element={<FencerList />} />
          <Route path="fencer/groups" element={<TrainerTrainingGroups />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
          <Route path="trainer" element={<TrainerHome />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["fencer"]} />}>
          <Route path="fencer" element={<FencerHome />} />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
};
