import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ChakraProvider } from '@chakra-ui/react'


import './App.css';
import { useSelector } from "react-redux";

import LoginPage from "./pages/user/auth/LoginPage.js";
import SignUpPage from "./pages/user/auth/SignUpPage.js";
import PasswordResetPage from "./pages/user/auth/PasswordResetPage.js";

import DriverSignup from "./pages/driver/auth/DriverSignup.js";
import DriverLogin from "./pages/driver/auth/DriverLogin.js";
import AddVehicleInfoPage from "./pages/driver/addInfo/AddVehicleInfoPage.js";
import AddPersonlInfoPage from "./pages/driver/addInfo/AddPersonlInfoPage.js";


import AdminLoginPage from "./pages/admin/auth/AdminLoginPage.js";
import DriverPasswordResetPage from "./pages/driver/auth/DriverPasswordResetPage.js";
import { rootState } from "./utils/interfaces.js";
import DriverDashboardPage from "./pages/driver/dashboard/DriverDashboardPage.js";
import DriverProfilePage from "./pages/driver/dashboard/DriverProfilePage.js";
import DriverVehicleInfoPage from "./pages/driver/dashboard/DriverVehicleInfoPage.js";
import UserManagementPage from "./pages/admin/user/UserManagementPage.js";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.js";
import DriverManagementPage from "./pages/admin/driver/DriverManagementPage.js";
import DriverAndVehicleValidationPage from "./pages/admin/driver/DriverAndVehicleValidationPage.js";



function App() {
  const user = useSelector((state: rootState) => state.user.loggedIn);
  const driver = useSelector((state: rootState) => state.driver.loggedIn);
  const admin = useSelector((state: rootState) => state.admin.loggedIn);
  // const driver = false
  // const user = false

  return (
    <>
      <Toaster />
      <ChakraProvider />
      <Router>
        <Routes>

          {/* USER */}

          <Route path="/login" element={user ? <Navigate to={"/"} /> : <LoginPage />} />
          <Route path="/signup" element={user ? <Navigate to={"/"} /> : <SignUpPage />} />
          <Route path="/resetpassword" element={<PasswordResetPage />} />

          {/* DRIVER */}
          <Route path="/driver/dashboard" element={driver ? <DriverDashboardPage /> : <Navigate to={'/driver/login'} />} />
          <Route path="/driver/info/personal" element={driver ? <AddPersonlInfoPage /> : <Navigate to={"/driver/login"} />} />
          <Route path="/driver/info/vehicle" element={driver ? <AddVehicleInfoPage /> : <Navigate to={"/driver/login"} />} />
          <Route path="/driver/profile" element={driver ? <DriverProfilePage /> : <Navigate to={"/driver/login"} />} />
          <Route path="/driver/vehicle" element={driver ? <DriverVehicleInfoPage /> : <Navigate to={"/driver/login"} />} />

          <Route path="/driver/signup" element={driver ? <Navigate to={"/driver/dashboard"} /> : <DriverSignup />} />
          <Route path="/driver/login" element={<DriverLogin />} />
          <Route path="/driver/resetpassword" element={<DriverPasswordResetPage />} />


          {/* ADMIN */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={admin ? <AdminDashboardPage /> : <Navigate to={"/admin/login"} />} />
          <Route path="/admin/user" element={admin ? <UserManagementPage /> : <Navigate to={"/admin/login"} />} />
          <Route path="/admin/driver" element={admin ? <DriverManagementPage /> : <Navigate to={"/admin/login"} />} />
          <Route path="/admin/verify" element={admin ? <DriverAndVehicleValidationPage /> : <Navigate to={"/admin/login"} />} />

        </Routes>
      </Router>
    </>
  );
}

export default App
