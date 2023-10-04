import Login from '../../../components/auth/login/Login'
import { loginComponentProps } from '../../../utils/interfaces'



function AdminLoginPage() {

    const data: loginComponentProps = {
        loginsucess: "/admin/dashboard",
        loginserver: "/admin/login",
        signup: "/admin/signup",
        person: "admin"
    }
    return (
        <div>
            <Login {...data} />
        </div>
    )
}

export default AdminLoginPage