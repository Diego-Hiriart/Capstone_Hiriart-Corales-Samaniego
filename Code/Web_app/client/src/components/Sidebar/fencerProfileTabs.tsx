import FencerProfileFencer from "../../pages/fencer/FencerProfileFencer";
import FencerProfileMedical from "../../pages/fencer/FencerProfileMedical";
import FencerProfilePersonal from "../../pages/fencer/FencerProfilePersonal";
import FencerProfileUser from "../../pages/fencer/FencerProfileUser";

export const fencerProfileTabs = [
  { label: "Información de Usuario", component: <FencerProfileUser /> },
  { label: "Información Personal", component: <FencerProfilePersonal /> },
  { label: "Información Esgrimista", component: <FencerProfileFencer /> },
  { label: "Información Medico", component: <FencerProfileMedical /> },
];
