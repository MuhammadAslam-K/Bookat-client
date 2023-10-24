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
import DriverNotificationPage from '../../pages/driver/dashboard/notification/DriverNotificationPage';
import DriverRideConfirmationPage from '../../pages/driver/dashboard/DriverRideConfirmationPage';
import DriverPaymentPage from '../../pages/driver/dashboard/DriverPaymentPage';
import DriverRideHistoryPage from '../../pages/driver/dashboard/history/DriverRideHistoryPage';
import DriverScheduleRideHistoryPages from '../../pages/driver/dashboard/history/DriverScheduleRidePages';
import DriverScheduleRideNotificationPage from '../../pages/driver/dashboard/notification/DriverScheduleRideNotificationPage';

const DriverRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<DriverPublicRoute component={DriverLogin} />} />
            <Route path="/signup" element={<DriverPublicRoute component={DriverSignup} />} />
            <Route path="/resetpassword" element={<DriverPasswordResetPage />} />

            <Route path="/info/personal" element={< AddPersonlInfoPage />} />
            <Route path="/info/vehicle" element={<AddVehicleInfoPage />} />

            <Route path="/dashboard" element={<DriverProtectedRoutes component={DriverDashboardPage} />} />
            <Route path="/profile" element={<DriverProtectedRoutes component={DriverProfilePage} />} />
            <Route path="/vehicle" element={<DriverProtectedRoutes component={DriverVehicleInfoPage} />} />
            <Route path="/notification" element={<DriverProtectedRoutes component={DriverNotificationPage} />} />

            <Route path="/rideconfirm" element={<DriverProtectedRoutes component={DriverRideConfirmationPage} />} />
            <Route path="/payment" element={<DriverProtectedRoutes component={DriverPaymentPage} />} />

            <Route path="/history/rides" element={<DriverProtectedRoutes component={DriverRideHistoryPage} />} />
            <Route path="/history/scheduleRide" element={<DriverProtectedRoutes component={DriverScheduleRideHistoryPages} />} />

            <Route path="/notification/ride" element={<DriverProtectedRoutes component={DriverNotificationPage} />} />
            <Route path="/notification/scheduleRide" element={<DriverProtectedRoutes component={DriverScheduleRideNotificationPage} />} />


        </Routes>
    );
};

export default DriverRoutes;
