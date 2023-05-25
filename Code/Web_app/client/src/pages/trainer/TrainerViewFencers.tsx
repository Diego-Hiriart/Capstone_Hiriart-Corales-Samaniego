import React from "react";
import SideBarList from "../../components/SideBarList";

const TrainerViewFencers = () => {
  const items = [
    { itemName: "Listado de alumnos", ref: "list" },
    { itemName: "Grupos", ref: "groups" },
  ];

  return (
    <SideBarList listItems={items}>
      <div>View</div>
    </SideBarList>
  );
};

export default TrainerViewFencers;
