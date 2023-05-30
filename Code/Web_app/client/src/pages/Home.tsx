import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"
import AdminHome from "./admin/AdminHome"
import FencerHome from "./fencer/FencerHome"
import TrainerHome from "./trainer/TrainerHome"

const Home = () => {
  const {user} = useContext(AuthContext)

  if (user?.roles.includes("admin")) {
    return (<AdminHome />)
  }
  if (user?.roles.includes("trainer")) {
    return (<TrainerHome />)
  }
  if (user?.roles.includes("fencer")) {
    return (<FencerHome />)
  }
  return (
    <Navigate to="/login" replace />
  )
}

export default Home