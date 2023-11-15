import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rootState } from '../../utils/interfaces';
import { RouteProps } from '../../interfaces/comman';


const UserProtectedRoute: React.FC<RouteProps> = ({ component: Component }) => {
    const user = useSelector((state: rootState) => state.user.loggedIn);

    console.log(user)
    if (!user) {

        return <Navigate to="/login" />;
    }
    return <Component />;
};

export default UserProtectedRoute;
