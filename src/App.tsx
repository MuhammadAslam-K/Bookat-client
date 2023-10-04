import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import './App.css';
// import UserRoute from "./routes/user/userRoute.js"
import { useSelector } from "react-redux";

import LoginPage from "./pages/userAuth/LoginPage.js";
import SignUpPage from "./pages/userAuth/SignUpPage.js";

import DriverSignup from "./pages/cab/driver/auth/DriverSignup.js";
import DriverLogin from "./pages/cab/driver/auth/DriverLogin.js";
import AddVehicleInfoPage from "./pages/cab/driver/addInfo/AddVehicleInfoPage.js";
import AddPersonlInfoPage from "./pages/cab/driver/addInfo/AddPersonlInfoPage.js";


import AdminLoginPage from "./pages/admin/auth/AdminLoginPage.js";


function App() {
  // const user = useSelector((state) => state.user.loggedIn);
  const driver = useSelector((state) => state.driver.loggedIn);
  const user = false

  return (
    <>
      <Toaster />
      <Router>
        {/* <UserRoute /> */}
        <Routes>

          {/* USER */}

          {/* <Route path="/" element={<HomePage />} /> */}
          {/* <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to={"/login"} />} /> */}
          <Route path="/login" element={user ? <Navigate to={"/"} /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to={"/"} /> : <SignUpPage />} />

          {/* DRIVER */}
          <Route path="/driver/signup" element={driver ? <Navigate to={"/"} /> : <DriverSignup />} />
          <Route path="/driver/login" element={driver ? <Navigate to={"/"} /> : <DriverLogin />} />
          <Route path="/driver/info/personal" element={driver ? <AddPersonlInfoPage /> : <Navigate to={"/driver/login"} />} />
          <Route path="/driver/info/vehicle" element={driver ? <AddVehicleInfoPage /> : <Navigate to={"/driver/login"} />} />

          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

        </Routes>
      </Router>
    </>
  );
}

export default App
