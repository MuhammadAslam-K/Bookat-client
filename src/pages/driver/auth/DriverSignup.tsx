import SignUp from '../../../components/auth/SignUp';
import { signupComponentProps } from '../../../utils/interfaces';


function DriverSignup() {
    const data: signupComponentProps = {
        login: "/driver/login",
        signupSuccess: "/driver/login",
        signupServer: "/driver/signup",
        checkExists: "/driver/check/driverExists",
        person: "driver"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default DriverSignup;
