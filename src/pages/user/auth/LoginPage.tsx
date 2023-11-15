import Login from "../../../components/auth/Login"
import { loginComponentProps } from "../../../interfaces/comman"
import userApis from "../../../Constraints/apis/userApis"
import userEndPoints from "../../../Constraints/endPoints/userEndPoints"

function LoginPage() {
    const data: loginComponentProps = {
        loginserver: userApis.login,
        signup: userEndPoints.signup,
        resetpassword: userApis.resetPasswordLink,
        person: "user",
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default LoginPage