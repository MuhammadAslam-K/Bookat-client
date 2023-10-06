import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import './App.css';
import { useSelector } from "react-redux";

import LoginPage from "./pages/userAuth/LoginPage.js";
import SignUpPage from "./pages/userAuth/SignUpPage.js";
import PasswordResetPage from "./pages/userAuth/PasswordResetPage.js";

import DriverSignup from "./pages/cab/driver/auth/DriverSignup.js";
import DriverLogin from "./pages/cab/driver/auth/DriverLogin.js";
import AddVehicleInfoPage from "./pages/cab/driver/addInfo/AddVehicleInfoPage.js";
import AddPersonlInfoPage from "./pages/cab/driver/addInfo/AddPersonlInfoPage.js";


import AdminLoginPage from "./pages/admin/auth/AdminLoginPage.js";
import DriverPasswordResetPage from "./pages/cab/driver/auth/DriverPasswordResetPage.js";
import { rootState } from "./utils/interfaces.js";



function App() {
  const user = useSelector((state: rootState) => state.user.loggedIn);
  const driver = useSelector((state: rootState) => state.driver.loggedIn);
  // const driver = false
  // const user = false

  return (
    <>
      <Toaster />
      <Router>
        <Routes>

          {/* USER */}

          <Route path="/login" element={user ? <Navigate to={"/"} /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to={"/"} /> : <SignUpPage />} />
          <Route path="/resetpassword" element={<PasswordResetPage />} />

          {/* DRIVER */}
          <Route path="/driver/info/personal" element={driver ? <AddPersonlInfoPage /> : <Navigate to={"/driver/login"} />} />
          <Route path="/driver/info/vehicle" element={driver ? <AddVehicleInfoPage /> : <Navigate to={"/driver/login"} />} />

          <Route path="/driver/signup" element={driver ? <Navigate to={"/driver/dashboard"} /> : <DriverSignup />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/resetpassword" element={<DriverPasswordResetPage />} />


          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

        </Routes>
      </Router>
    </>
  );
}

export default App
