import { useContext } from "react"
import { Navigate } from "react-router-dom"

import AuthContext from "../contexts/AuthContext"
import FencerProfile from "./fencer/FencerProfile"
import TrainerProfile from "./trainer/TrainerProfile"

const Home = () => {
  const {user} = useContext(AuthContext)

  if (user?.roles.includes("trainer")) {
    return (<TrainerProfile />)
  }
  if (user?.roles.includes("fencer")) {
    return (<FencerProfile />)
  }
  return (
    <Navigate to="/" replace />
  )
}

export default Home
