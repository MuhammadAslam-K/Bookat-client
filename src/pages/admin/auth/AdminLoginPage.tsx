import Login from '../../../components/auth/Login'
import adminApis from '../../../Constraints/apis/adminApis'
import { loginComponentProps } from '../../../utils/interfaces'



function AdminLoginPage() {

    const data: loginComponentProps = {
        loginserver: adminApis.login,
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