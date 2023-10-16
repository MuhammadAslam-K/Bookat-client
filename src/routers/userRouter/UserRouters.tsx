import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import UserProtectedRoute from './UserProtectedRoutes';
import UserPublicRoute from './UserPublicRoutes';

import LoginPage from '../../pages/user/auth/LoginPage';
import SignUpPage from '../../pages/user/auth/SignUpPage';
import PasswordResetPage from '../../pages/user/auth/PasswordResetPage';
import UserHomePage from '../../pages/user/home/UserHomePage';



const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<UserPublicRoute component={LoginPage} />} />
            <Route path="/signup" element={< UserPublicRoute component={SignUpPage} />} />
            <Route path="/resetpassword" element={<PasswordResetPage />} />


            <Route path="/" element={<UserHomePage />} />

        </Routes>
    );
};

export default UserRoutes;
