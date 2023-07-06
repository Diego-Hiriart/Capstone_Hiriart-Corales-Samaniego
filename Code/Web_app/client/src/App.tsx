import "dayjs/locale/es";
import SignupForm from "./pages/fencer/SignupForm";
import { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import Snackbar from "./components/Snackbar";
import AuthContext from "./contexts/AuthContext";
import Unauthorized from "./pages/Unauthorized";
import GroupDetails from "./pages/group/GroupDetails";
import MesoCycleDetails from "./pages/mesocycle/MesoCycleDetails";
import CreateTrainer from "./pages/trainer/TrainerCreate";
import TrainerList from "./pages/trainer/TrainerList";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerViewFencers from "./pages/trainer/TrainerViewFencers";
import ProtectedRoute from "./routes/ProtectedRoute";
import SignupPersonalForm from "./pages/fencer/SignupPersonalForm";
import SignupFencerForm from "./pages/fencer/SignupFencerForm";
import SignupContextRoute from "./routes/SignupContextRoute";
import SignupMedicalForm from "./pages/fencer/SignupMedicalForm";
import Login from "./pages/Login";
import Home from "./pages/Home";
import FencerDetail from "./pages/fencer/FencerDetail";
import FencerFeedback from "./pages/fencer/FencerFeedback";
import dayjs from "dayjs";
import Profile from "./pages/Profile";
import FencerAITrainings from "./pages/fencer/FencerAITrainings";
import AITrainingDetail from "./pages/fencer/AITrainingDetail";
import AITrainingDetection from "./pages/fencer/AITrainingDetection";
import { navbarExcludePaths } from "./Constants";
import TrainerCombat from "./pages/combat/TrainerCombat";
import CombatDetails from "./pages/combat/CombatDetails";
import useTab from "./hooks/useTab";
import AcademyOptions from "./pages/academy/AcademyOptions";
import AIConfig from "./pages/admin/AIConfig";
import AdminProfile from "./pages/admin/AdminProfile";

export const App = () => {
  const { checkToken } = useContext(AuthContext);
  const location = useLocation();
  const { setTabItems } = useTab();

  useEffect(() => {
    dayjs.locale("es");
    checkToken();
  }, []);

  useEffect(() => {
    setTabItems(null);
  }, [location]);

  return (
    <div>
      {!navbarExcludePaths.includes(location.pathname) && <NavBar />}
      <Snackbar />
      {/* ^--- This is to avoid the content to be hidden by the navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<SignupContextRoute />}>
          <Route path="/signup">
            <Route index element={<SignupForm />} />
            {/* TODO: make this routes innaccesible from the url */}
            <Route path="personal" element={<SignupPersonalForm />} />
            <Route path="fencer" element={<SignupFencerForm />} />
            <Route path="medical" element={<SignupMedicalForm />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="trainer" element={<TrainerList />} />
          <Route path="trainer/create" element={<CreateTrainer />} />
          <Route path="ai-config" element={<AIConfig />} />
          <Route path="admin/profile" element={<AdminProfile />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin", "trainer"]} />}>
          <Route path="academy" element={<AcademyOptions />} />
          <Route path="trainer/:id" element={<TrainerProfile />} />
          <Route path="fencer" element={<TrainerViewFencers />} />
          <Route path="fencer/:id" element={<FencerDetail />} />
          <Route
            path="fencer/groups/:id/cycles/:id"
            element={<MesoCycleDetails />}
          />
          <Route path="fencer/groups/:id" element={<GroupDetails />} />
          <Route path="fencer/aitraining/:id" element={<AITrainingDetail />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["fencer", "trainer"]} />}
        >
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["fencer"]} />}>
          <Route path="groups/:id/cycles/:id" element={<MesoCycleDetails />} />
          <Route path="groups/:id" element={<GroupDetails />} />
          <Route path="aitrainings/new" element={<AITrainingDetection />} />
          <Route path="feedback" element={<FencerFeedback />} />
          <Route path="aitrainings" element={<FencerAITrainings />} />
          <Route path="aitrainings/:id" element={<AITrainingDetail />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={["fencer", "trainer", "admin"]} />
          }
        >
          <Route path="combats/:id" element={<CombatDetails />} />
          <Route path="combats" element={<TrainerCombat />} />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
};
