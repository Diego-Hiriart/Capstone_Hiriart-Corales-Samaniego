import React from "react";
import SideBarList from "../../components/SideBarList";
import MesoCycleDetails from "./MesoCycleDetails";

const MesoCycleOptions = () => {
  const items = [
    { itemName: "Objetivo", ref: "goals" },
    { itemName: "Feedback", ref: "feedback" },
  ];

  return (
    <SideBarList listItems={items}>
      <MesoCycleDetails />
    </SideBarList>
  );
};

export default MesoCycleOptions;
