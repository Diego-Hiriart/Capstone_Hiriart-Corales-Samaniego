import SideBarList from "../../components/SideBarList"

const items = [
  { itemName: "Feedback", ref: "feedback" },
  { itemName: "Entrenamientos IA", ref: "aitrainings" },
];

const FencerDetail = () => {
  return (
    <SideBarList listItems={items}>
      <h1>Fencer Detail</h1>
    </SideBarList>
  )
}

export default FencerDetail 