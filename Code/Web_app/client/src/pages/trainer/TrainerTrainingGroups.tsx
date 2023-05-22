import React from "react";
import SideBarList from "../../components/SideBarList";

const TrainerTrainingGroups = () => {
  const items = [
    { itemName: "Listado de alumnos", ref: "fencer" },
    { itemName: "Grupos", ref: "fencer/groups" },
  ];

  return (
    <SideBarList listItems={items}>
      <div>sdaasaaaaaaaaaaaaaaaaaaaaaaad</div>
    </SideBarList>
  );
};

export default TrainerTrainingGroups;
