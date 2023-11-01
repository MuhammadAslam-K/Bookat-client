import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoutes';
import AdminPublicRoute from './AdminPublicRoute';

import AdminDashboardPage from '../../pages/admin/AdminDashboardPage';
import UserManagementPage from '../../pages/admin/user/UserManagementPage';
import DriverManagementPage from '../../pages/admin/driver/DriverManagementPage';
import DriverAndVehicleValidationPage from '../../pages/admin/driver/DriverAndVehicleValidationPage';
import AdminLoginPage from '../../pages/admin/auth/AdminLoginPage';
import ListAllCabsPage from '../../pages/admin/cab/ListAllCabsPage';

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={< AdminPublicRoute component={AdminLoginPage} />} />


            <Route path="/dashboard" element={<AdminProtectedRoute component={AdminDashboardPage} />} />
            <Route path="/users" element={<AdminProtectedRoute component={UserManagementPage} />} />
            <Route path="/drivers" element={<AdminProtectedRoute component={DriverManagementPage} />} />
            <Route path="/verify" element={<AdminProtectedRoute component={DriverAndVehicleValidationPage} />} />
            <Route path="/cabs" element={<AdminProtectedRoute component={ListAllCabsPage} />} />

        </Routes>
    );
};

export default AdminRoutes;
