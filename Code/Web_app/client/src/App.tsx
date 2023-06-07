import { Toolbar } from "@mui/material";
import "dayjs/locale/es";
import { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import Snackbar from "./components/Snackbar";
import AuthContext from "./contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ActivityList from "./pages/activity/ActivityList";
import AdminHome from "./pages/admin/AdminHome";
import FencerHome from "./pages/fencer/FencerHome";
import FencerList from "./pages/fencer/FencerList";
import Signup from "./pages/fencer/Signup";
import GroupDetails from "./pages/group/GroupDetails";
import GroupFencersList from "./pages/group/GroupFencersList";
import GroupMesoCycle from "./pages/group/GroupMesoCycle";
import MesoCycleDetails from "./pages/mesocycle/MesoCycleDetails";
import CreateTrainer from "./pages/trainer/TrainerCreate";
import TrainerHome from "./pages/trainer/TrainerHome";
import TrainerList from "./pages/trainer/TrainerList";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerTrainingGroups from "./pages/trainer/TrainerTrainingGroups";
import TrainerViewFencers from "./pages/trainer/TrainerViewFencers";
import ProtectedRoute from "./routes/ProtectedRoute";

export const App = () => {
  const { user, checkToken } = useContext(AuthContext);

  useEffect(() => {
    checkToken();
  }, []);

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
          <Route path="activity" element={<ActivityList />} />
          <Route path="trainer/:id" element={<TrainerProfile />} />
          <Route path="fencer" element={<TrainerViewFencers />} />
          <Route path="fencer/list" element={<FencerList />} />
          <Route
            path="fencer/groups/:id/cycles/:id"
            element={<MesoCycleDetails />}
          />
          <Route path="fencer/groups/:id/cycles" element={<GroupMesoCycle />} />
          <Route path="fencer/groups/:id/list" element={<GroupFencersList />} />
          <Route path="fencer/groups/:id" element={<GroupDetails />} />
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
