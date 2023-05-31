import SideBarList from "../../components/SideBarList"

const items = [
  { itemName: "Feedback", ref: "feedback" },
];

const FencerDetail = () => {
  return (
    <SideBarList listItems={items}>
      <h1>Fencer Detail</h1>
    </SideBarList>
  )
}

export default FencerDetail 