import Login from '../../../../components/auth/login/Login'
import { loginComponentProps } from '../../../../utils/interfaces'


function DriverLogin() {
    const data: loginComponentProps = {
        loginserver: "/driver/login",
        signup: "/driver/signup",
        resetpassword: "/driver/resetPasswordLink",
        person: "driver"
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default DriverLogin