import SignUp from "../../../components/auth/SignUp";
import userApis from "../../../Constraints/apis/userApis";
import userEndPoints from "../../../Constraints/endPoints/userEndPoints";
import { signupComponentProps } from "../../../utils/interfaces";

function SignUpPage() {
    const data: signupComponentProps = {
        login: userEndPoints.login,
        signupSuccess: userEndPoints.login,

        signupServer: userApis.signUp,
        checkExists: userApis.chekUserExists,
        person: "user"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default SignUpPage