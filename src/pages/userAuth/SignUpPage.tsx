import SignUp from "../../components/auth/signup/SignUp";
import userEndPoints from "../../endpoints/userEndPoints";
import { signupComponentProps } from "../../utils/interfaces";

function SignUpPage() {
    const data: signupComponentProps = {
        login: "/login",
        signupSuccess: "/login",
        signupServer: userEndPoints.signUp,
        checkExists: userEndPoints.chekUserExists,
        person: "user"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default SignUpPage