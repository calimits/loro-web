import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import CurrentView from "./components/Views/CurrentView";
import SignUpView from "./components/Views/SignUpView";
import LoginView from "./components/Views/LoginView";
import LogoutView from "./components/Views/LogoutView";
import { useAuth } from "./components/AuthContext";
import { useEffect, useState } from "react";
import DeleteAccountView from "./components/Views/DeleteAccountView"

function App() {
  const { isAuth, checkAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      await checkAuth();
      setIsLoading(false)
    }
    initializeAuth();
  }, []);


  if (isLoading) return <h2>Loading ...</h2>;

  return (
      <Router basename="/loro-web">
        <Routes>
          <Route path="/" element={isAuth ? <CurrentView/> : <Navigate to="/login"/>}></Route>
          <Route path="/sign-up" element={<SignUpView/>}></Route>
          <Route path="/login" element={<LoginView/>}></Route>
          <Route path="/logout" element={<LogoutView/>}></Route>
          <Route path="/delete-account" element={<DeleteAccountView/>}></Route>
        </Routes>
      </Router>
  );
}

export default App;
