import "dayjs/locale/es";
import SignupForm from "./pages/fencer/SignupForm";
import { useContext, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import Snackbar from "./components/Snackbar";
import AuthContext from "./contexts/AuthContext";
import Unauthorized from "./pages/Unauthorized";
import ActivityList from "./pages/activity/ActivityList";
import GroupDetails from "./pages/group/GroupDetails";
import GroupFencersList from "./pages/group/GroupFencersList";
import GroupMesoCycle from "./pages/group/GroupMesoCycle";
import MesoCycleDetails from "./pages/mesocycle/MesoCycleDetails";
import CreateTrainer from "./pages/trainer/TrainerCreate";
import TrainerList from "./pages/trainer/TrainerList";
import TrainerProfile from "./pages/trainer/TrainerProfile";
import TrainerTrainingGroups from "./pages/trainer/TrainerTrainingGroups";
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
import FencerProfilePersonal from "./pages/fencer/FencerProfilePersonal";
import FencerProfileFencer from "./pages/fencer/FencerProfileFencer";
import FencerProfileMedical from "./pages/fencer/FencerProfileMedical";
import Profile from "./pages/Profile";
import FencerProfileUser from "./pages/fencer/FencerProfileUser";
import FencerGroupList from "./pages/fencer/groups/FencerGroupList";
import FencerGroupMesoCycle from "./pages/fencer/groups/FencerGroupMesoCycle";
import FencerMesoCycleDetails from "./pages/fencer/groups/FencerMesoCycleDetails";
import FencerAITrainings from "./pages/fencer/FencerAITrainings";
import AITrainingDetail from "./pages/fencer/AITrainingDetail";
import AITrainingDetection from "./pages/fencer/AITrainingDetection";
import { navbarExcludePaths } from "./Constants";
import TrainerCombat from "./pages/combat/TrainerCombat";
import CombatDetails from "./pages/combat/CombatDetails";

export const App = () => {
  const { checkToken } = useContext(AuthContext);
  const { pathname } = useLocation();

  useEffect(() => {
    dayjs.locale("es");
    checkToken();
  }, []);

  return (
    <div>
      {!navbarExcludePaths.includes(pathname) && <NavBar />}
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
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin", "trainer"]} />}>
          <Route path="activity" element={<ActivityList />} />
          <Route path="trainer/:id" element={<TrainerProfile />} />
          <Route path="fencer" element={<TrainerViewFencers />} />
          <Route path="fencer/:id" element={<FencerDetail />} />
          <Route
            path="fencer/groups/:id/cycles/:id"
            element={<MesoCycleDetails />}
          />
          <Route path="fencer/groups/:id/cycles" element={<GroupMesoCycle />} />
          <Route path="fencer/groups/:id/list" element={<GroupFencersList />} />
          <Route path="fencer/groups/:id" element={<GroupDetails />} />
          <Route path="fencer/aitraining/:id" element={<AITrainingDetail />} />
        </Route>
        <Route
          element={<ProtectedRoute allowedRoles={["fencer", "trainer"]} />}
        >
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["fencer"]} />}>
          <Route path="profile/user" element={<FencerProfileUser />} />
          <Route path="profile/personal" element={<FencerProfilePersonal />} />
          <Route path="profile/fencer" element={<FencerProfileFencer />} />
          <Route path="profile/medical" element={<FencerProfileMedical />} />
          <Route
            path="groups/:id/cycles/:id"
            element={<FencerMesoCycleDetails />}
          />
          <Route path="groups/:id/cycles" element={<FencerGroupMesoCycle />} />
          <Route path="groups/:id/list" element={<FencerGroupList />} />
          <Route path="groups/:id" element={<GroupDetails />} />
          <Route path="aitraining/new" element={<AITrainingDetection />} />
          <Route path="feedback" element={<FencerFeedback />} />
          <Route path="aitraining" element={<FencerAITrainings />} />
          <Route path="aitraining/:id" element={<AITrainingDetail />} />
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
