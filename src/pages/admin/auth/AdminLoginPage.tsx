import Login from '../../../components/auth/Login'
import adminEndPoints from '../../../endpoints/adminEndPoints'
import { loginComponentProps } from '../../../utils/interfaces'



function AdminLoginPage() {

    const data: loginComponentProps = {
        loginserver: adminEndPoints.login,
        signup: "/admin/signup",
        resetpassword: "",
        person: "admin"
    }
    return (
        <div>
            <Login {...data} />
        </div>
    )
}

export default AdminLoginPage