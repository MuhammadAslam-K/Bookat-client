import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DriverProtectedRoutes from './DriverProtectedRoutes';
import DriverPublicRoute from './DriverPublicRoute';

import DriverSignup from '../../pages/driver/auth/DriverSignup';
import DriverLogin from '../../pages/driver/auth/DriverLogin';
import DriverDashboardPage from '../../pages/driver/dashboard/DriverDashboardPage';
import DriverProfilePage from '../../pages/driver/dashboard/DriverProfilePage';
import AddPersonlInfoPage from '../../pages/driver/addInfo/AddPersonlInfoPage';
import AddVehicleInfoPage from '../../pages/driver/addInfo/AddVehicleInfoPage';
import DriverVehicleInfoPage from '../../pages/driver/dashboard/DriverVehicleInfoPage';
import DriverPasswordResetPage from '../../pages/driver/auth/DriverPasswordResetPage';

const DriverRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<DriverPublicRoute component={DriverLogin} />} />
            <Route path="/signup" element={<DriverPublicRoute component={DriverSignup} />} />
            <Route path="/resetpassword" element={<DriverPasswordResetPage />} />

            <Route path="/info/personal" element={<DriverProtectedRoutes component={AddPersonlInfoPage} />} />
            <Route path="/info/vehicle" element={<DriverProtectedRoutes component={AddVehicleInfoPage} />} />

            <Route path="/dashboard" element={<DriverProtectedRoutes component={DriverDashboardPage} />} />
            <Route path="/profile" element={<DriverProtectedRoutes component={DriverProfilePage} />} />
            <Route path="/vehicle" element={<DriverProtectedRoutes component={DriverVehicleInfoPage} />} />
        </Routes>
    );
};

export default DriverRoutes;
