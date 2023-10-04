import Login from '../../../../components/auth/login/Login'
import { loginComponentProps } from '../../../../utils/interfaces'


function DriverLogin() {
    const data: loginComponentProps = {
        loginsucess: "/driver/dashboard",
        loginserver: "/driver/login",
        signup: "/driver/signup",
        person: "driver"
    }
    return (
        <>
            <Login {...data} />
        </>
    )
}

export default DriverLogin