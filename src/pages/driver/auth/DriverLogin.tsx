import Login from '../../../components/auth/Login'
import driverApis from '../../../Constraints/apis/driverApis'
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints'
import { loginComponentProps } from '../../../utils/interfaces'


function DriverLogin() {
    const data: loginComponentProps = {
        loginserver: driverApis.login,
        signup: driverEndPoints.signup,
        resetpassword: driverApis.resetPasswordLink,
        person: "driver"
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default DriverLogin