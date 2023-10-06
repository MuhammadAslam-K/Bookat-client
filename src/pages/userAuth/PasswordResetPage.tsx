import { useLocation } from 'react-router-dom';
import PasswordReset from '../../components/auth/passwordReset/PasswordReset'

function PasswordResetPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: "/resetpassword",
        id: id,
        successNavigation: "/login"
    }
    return (
        <>
            <PasswordReset {...data} />
        </>
    )
}

export default PasswordResetPage