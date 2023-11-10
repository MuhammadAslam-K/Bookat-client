import Navbar from "../../../components/admin/common/AdminNavbar"
import AdminFooter from "../../../components/admin/common/AdminFooter"
import UserDataTable from "../../../components/admin/user/UserDataTable"

function UserManagementPage() {

    return (
        <div className="bg-gray-100 h-auto">
            <Navbar />
            <UserDataTable />
            <div className="mt-20">
                <AdminFooter />
            </div>
        </div>
    )
}

export default UserManagementPage