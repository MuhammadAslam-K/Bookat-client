import Login from '../../../components/auth/login/Login'
import { loginComponentProps } from '../../../utils/interfaces'



function AdminLoginPage() {

    const data: loginComponentProps = {
        loginserver: "/admin/login",
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