import React from 'react';
import { Routes, Route } from 'react-router-dom';
import UserProtectedRoute from './UserProtectedRoutes';
import UserPublicRoute from './UserPublicRoutes';

import LoginPage from '../../pages/user/auth/LoginPage';
import SignUpPage from '../../pages/user/auth/SignUpPage';
import PasswordResetPage from '../../pages/user/auth/PasswordResetPage';
import UserHomePage from '../../pages/user/home/UserHomePage';
import UserRideConfirmationPage from '../../pages/user/home/ride/UserRideConfirmationPage';
import UserProfilePage from '../../pages/user/home/UserProfilePage';
import UserPaymentPage from '../../pages/user/home/UserPaymentPage';
import RideHistoryPage from '../../pages/user/history/UserRideHistoryPage';
import CurrentRidePage from '../../pages/user/home/ride/CurrentRidePage';
import SheduledRidePage from '../../pages/user/home/ride/SheduledRide';
import UserSideDriverInfoPage from '../../pages/user/home/ride/UserSideDriverInfoPage';
import UserReviewAndRatingPage from '../../pages/user/home/UserReviewAndRatingPage';



const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<UserPublicRoute component={LoginPage} />} />
            <Route path="/signup" element={< UserPublicRoute component={SignUpPage} />} />
            <Route path="/resetpassword" element={<PasswordResetPage />} />


            <Route path="/" element={<UserHomePage />} />
            <Route path="/rideconfirm" element={<UserProtectedRoute component={UserRideConfirmationPage} />} />
            <Route path="/profile" element={<UserProtectedRoute component={UserProfilePage} />} />
            <Route path="/payment" element={<UserProtectedRoute component={UserPaymentPage} />} />
            <Route path="/review" element={<UserProtectedRoute component={UserReviewAndRatingPage} />} />

            <Route path="/history" element={<UserProtectedRoute component={RideHistoryPage} />} />

            <Route path="/currentRide" element={<UserProtectedRoute component={CurrentRidePage} />} />
            <Route path="/sheduledRide" element={<UserProtectedRoute component={SheduledRidePage} />} />
            <Route path="/driverInfo" element={<UserProtectedRoute component={UserSideDriverInfoPage} />} />
        </Routes>
    );
};

export default UserRoutes;
