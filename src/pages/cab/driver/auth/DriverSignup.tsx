import SignUp from '../../../../components/auth/signup/SignUp';
import { signupComponentProps } from '../../../../utils/interfaces';


function DriverSignup() {
    const data: signupComponentProps = {
        login: "/driver/login",
        signupSuccess: "/driver/info/personal",
        signupServer: "/driver/signup",
        person: "driver"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default DriverSignup;
