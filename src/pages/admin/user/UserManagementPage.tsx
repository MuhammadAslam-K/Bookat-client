import Navbar from "../../../components/admin/AdminNavbar"
import DataTable from "../../../components/admin/DataTable"
import adminEndPoints from "../../../endpoints/adminEndPoints"

function UserManagementPage() {
    const data = {
        blockEndpoint: adminEndPoints.blockUser,
        getData: adminEndPoints.getuserData,
        role: "user"
    }
    return (
        <div className="bg-gray-100">
            <Navbar />
            <DataTable {...data} />
        </div>
    )
}

export default UserManagementPage