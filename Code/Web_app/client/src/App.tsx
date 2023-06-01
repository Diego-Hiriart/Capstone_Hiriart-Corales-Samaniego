import { Toolbar } from "@mui/material";
import "dayjs/locale/es";
import SignupForm from "./pages/fencer/SignupForm";
import { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import NavBar from "./components/Navbar/Navbar";
import Snackbar from "./components/Snackbar";
import AuthContext from "./contexts/AuthContext";
import Unauthorized from "./pages/Unauthorized";
import FencerList from "./pages/fencer/FencerList";
import GroupDetails from "./pages/group/GroupDetails";
import GroupFencersList from "./pages/group/GroupFencersList";
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

export const App = () => {
  const { checkToken } = useContext(AuthContext);

  useEffect(() => {
    dayjs.locale("es");
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
          <Route path="trainer/:id" element={<TrainerProfile />} />
          <Route path="fencer" element={<TrainerViewFencers />} />
          <Route path="fencer/:id" element={<FencerDetail />} />
          <Route path="fencer/list" element={<FencerList />} />
          <Route path="fencer/groups/:id/list" element={<GroupFencersList />} />
          <Route path="fencer/groups/:id" element={<GroupDetails />} />
          <Route path="fencer/groups" element={<TrainerTrainingGroups />} />
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
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={["fencer", "trainer", "admin"]} />
          }
        >
          <Route path="fencer/:id/feedback" element={<FencerFeedback />} />
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<h1>Not found</h1>} />
      </Routes>
    </div>
  );
};
