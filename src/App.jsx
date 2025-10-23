import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import HomeView from "./components/Views/HomeView"
import SignUpView from "./components/Views/SignUpView"
import LoginView from "./components/Views/LoginView"
import LogoutView from "./components/Views/LogoutView"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomeView/>}></Route>
          <Route path="/sign-up" element={<SignUpView/>}></Route>
          <Route path="/login" element={<LoginView/>}></Route>
          <Route path="/logout" element={<LogoutView/>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
