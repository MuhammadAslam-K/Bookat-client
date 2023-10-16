import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rootState } from '../../utils/interfaces';

interface ProtectedRouteProps {
    component: React.FC;
}

const AdminProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
    const admin = useSelector((state: rootState) => state.admin.loggedIn);

    console.log(admin)
    if (!admin) {

        return <Navigate to="/admin/login" />;
    }
    return <Component />;
};

export default AdminProtectedRoute;
