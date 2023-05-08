import { useEffect } from "react"
import { useParams } from "react-router-dom";
import axios from "../../services/axios";

const TrainerProfile = () => {
  const { userID } = useParams();

  useEffect(() => {
    const fetchTrainer = async () => {
      const { data } = await axios.get(`/dashboard/trainer/${userID}`);
      console.log(data);
    }
    fetchTrainer();
  })
  return (
    <div>TrainerProfile</div>
  )
}

export default TrainerProfile