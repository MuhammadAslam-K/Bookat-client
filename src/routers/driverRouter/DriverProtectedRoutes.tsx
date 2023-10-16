import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rootState } from '../../utils/interfaces';

interface ProtectedRouteProps {
    component: React.FC;
}

const DriverProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const driver = useSelector((state: rootState) => state.driver.loggedIn);

    console.log(driver)
    if (!driver) {

        return <Navigate to="/driver/login" />;
    }
    return <Component />;
};

export default DriverProtectedRoute;
