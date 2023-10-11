import Navbar from "../../../components/cab/admin/AdminNavbar"
import DataTable from "../../../components/cab/admin/DataTable"
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