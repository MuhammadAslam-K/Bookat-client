import Login from '../../../components/auth/Login'
import driverEndPoint from '../../../endpoints/driverEndPoint'
import { loginComponentProps } from '../../../utils/interfaces'


function DriverLogin() {
    const data: loginComponentProps = {
        loginserver: driverEndPoint.login,
        signup: "/driver/signup",
        resetpassword: driverEndPoint.resetPasswordLink,
        person: "driver"
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default DriverLogin