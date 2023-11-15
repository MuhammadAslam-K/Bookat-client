import driverApis from '../../../Constraints/apis/driverApis';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';
import SignUp from '../../../components/auth/SignUp';
import { signupComponentProps } from '../../../interfaces/comman';


function DriverSignup() {
    const data: signupComponentProps = {
        login: driverEndPoints.login,
        signupSuccess: driverEndPoints.login,
        signupServer: driverApis.signUp,
        checkExists: driverApis.chekDriverExists,
        person: "driver"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default DriverSignup;
