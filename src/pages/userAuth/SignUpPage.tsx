import SignUp from "../../components/auth/signup/SignUp";
import { signupComponentProps } from "../../utils/interfaces";

function SignUpPage() {
    const data: signupComponentProps = {
        login: "/login",
        signupSuccess: "/login",
        signupServer: "/signup",
        checkExists: "/check/userExists",
        person: "user"
    };

    return (
        <>
            <SignUp {...data} />
        </>
    );
}

export default SignUpPage