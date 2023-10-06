import { useLocation } from 'react-router-dom';
import PasswordReset from '../../../../components/auth/passwordReset/PasswordReset';

function DriverPasswordResetPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: "/driver/resetpassword",
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