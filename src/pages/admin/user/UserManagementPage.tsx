import Navbar from "../../../components/admin/AdminNavbar"
import DataTable from "../../../components/admin/DataTable"
import adminApis from "../../../Constraints/apis/adminApis"

function UserManagementPage() {
    const data = {
        blockEndpoint: adminApis.blockUser,
        getData: adminApis.getuserData,
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