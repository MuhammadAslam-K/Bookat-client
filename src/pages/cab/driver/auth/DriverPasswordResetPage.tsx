import { useLocation } from 'react-router-dom';
import PasswordReset from '../../../../components/auth/passwordReset/PasswordReset';
import driverEndPoint from '../../../../endpoints/driverEndPoint';

function DriverPasswordResetPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: driverEndPoint.resetPassword,
        id: id,
        successNavigation: "/driver/login"
    }
    return (
        <>
            <PasswordReset {...data} />
        </>
    )
}

export default DriverPasswordResetPage