import Navbar from "../../../components/admin/AdminNavbar"
import UserDataTable from "../../../components/admin/user/UserDataTable"

function UserManagementPage() {

    return (
        <div className="bg-gray-100 h-screen">
            <Navbar />
            <UserDataTable />
        </div>
    )
}

export default UserManagementPage