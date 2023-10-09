import Login from "../../components/auth/login/Login"
import { loginComponentProps } from "../../utils/interfaces"
import userEndPoints from "../../endpoints/userEndPoints"

function LoginPage() {
    const data: loginComponentProps = {
        loginserver: userEndPoints.login,
        signup: "/signup",
        resetpassword: userEndPoints.resetPasswordLink,
        person: "user",
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default LoginPage