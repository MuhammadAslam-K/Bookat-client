import Login from "../../components/auth/login/Login"
import { loginComponentProps } from "../../utils/interfaces"

function LoginPage() {
    const data: loginComponentProps = {
        loginserver: "/signin",
        signup: "/signup",
        resetpassword: "/resetPasswordLink",
        person: "user",
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default LoginPage