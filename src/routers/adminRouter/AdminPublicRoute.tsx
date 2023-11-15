import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rootState } from '../../utils/interfaces';
import { RouteProps } from '../../interfaces/comman';



const AdminPublicRoute: React.FC<RouteProps> = ({ component: Component }) => {
    const admin = useSelector((state: rootState) => state.admin.loggedIn);

    console.log(admin)
    if (admin) {

        return <Navigate to="/admin/dashboard" />;
    }
    return <Component />;
};

export default AdminPublicRoute;
