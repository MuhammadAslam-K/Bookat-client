import { useLocation } from 'react-router-dom';
import PasswordReset from '../../../components/auth/PasswordReset'
import userApis from '../../../Constraints/apis/userApis';
import userEndPoints from '../../../Constraints/endPoints/userEndPoints';

function PasswordResetPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: userApis.resetPassword,
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