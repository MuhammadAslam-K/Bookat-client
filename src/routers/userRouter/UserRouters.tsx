import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProtectedRoute from './UserProtectedRoutes';
import UserPublicRoute from './UserPublicRoutes';

import LoginPage from '../../pages/user/auth/LoginPage';
import SignUpPage from '../../pages/user/auth/SignUpPage';
import PasswordResetPage from '../../pages/user/auth/PasswordResetPage';
import UserHomePage from '../../pages/user/home/UserHomePage';
import UserRideConfirmationPage from '../../pages/user/home/UserRideConfirmationPage';
import UserProfilePage from '../../pages/user/home/UserProfilePage';



const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<UserPublicRoute component={LoginPage} />} />
            <Route path="/signup" element={< UserPublicRoute component={SignUpPage} />} />
            <Route path="/resetpassword" element={<PasswordResetPage />} />


            <Route path="/" element={<UserHomePage />} />
            <Route path="/rideconfirm" element={<UserProtectedRoute component={UserRideConfirmationPage} />} />
            <Route path="/profile" element={<UserProtectedRoute component={UserProfilePage} />} />

        </Routes>
    );
};

export default UserRoutes;
