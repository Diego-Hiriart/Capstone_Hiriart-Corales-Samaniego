import SideBarList from "../../components/SideBarList";

const items = [
  { itemName: "Informacion Usuario", ref: "user" },
  { itemName: "Informacion Personal", ref: "personal" },
  { itemName: "Informacion Esgrimista", ref: "fencer" },
  { itemName: "Informacion Medica", ref: "medical" },
];

const FencerProfile = () => {
  return (
    <SideBarList listItems={items}>
      <h1>Fencer Profile</h1>
    </SideBarList>
  );
};

export default FencerProfile;
