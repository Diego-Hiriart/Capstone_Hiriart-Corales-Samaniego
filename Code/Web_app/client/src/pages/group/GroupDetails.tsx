import React from "react";
import SideBarList from "../../components/SideBarList";

const GroupDetails = () => {
  const items = [
    { itemName: "Integrantes", ref: "list" },
    { itemName: "Meso-ciclo", ref: "cycles" },
  ];

  // TODO: Fetch group data and store in context or sm

  return (
    <SideBarList listItems={items}>
      <div>Details</div>
    </SideBarList>
  );
};

export default GroupDetails;
