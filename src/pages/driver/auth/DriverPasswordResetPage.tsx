import { useLocation } from 'react-router-dom';
import PasswordReset from '../../../components/auth/PasswordReset';
import driverApis from '../../../Constraints/apis/driverApis';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';

function DriverPasswordResetPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = {
        passwordResetServer: driverApis.resetPassword,
        id: id,
        successNavigation: driverEndPoints.login
    }
    return (
        <>
            <PasswordReset {...data} />
        </>
    )
}

export default DriverPasswordResetPage