import { useLocation } from 'react-router-dom';
import PasswordReset from '../../components/auth/passwordReset/PasswordReset'
import userEndPoints from '../../endpoints/userEndPoints';

function PasswordResetPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: userEndPoints.resetPassword,
        id: id,
        successNavigation: userEndPoints.login
    }
    return (
        <>
            <PasswordReset {...data} />
        </>
    )
}

export default PasswordResetPage