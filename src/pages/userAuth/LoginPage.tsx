import Login from "../../components/auth/login/Login"
import { loginComponentProps } from "../../utils/interfaces"

function LoginPage() {
    const data: loginComponentProps = {
        loginsucess: "/",
        loginserver: "/signin",
        signup: "/signup",
        person: "user",
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default LoginPage