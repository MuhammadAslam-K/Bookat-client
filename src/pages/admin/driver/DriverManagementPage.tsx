import Navbar from "../../../components/admin/AdminNavbar"
import DataTable from "../../../components/admin/DataTable"
import adminApis from "../../../Constraints/apis/adminApis"

function DriverManagementPage() {
    const data = {
        blockEndpoint: adminApis.blockDriver,
        getData: adminApis.getDriversData,
        role: "driver"
    }
    return (
        <div className="bg-gray-100">
            <Navbar />
            <DataTable {...data} />
        </div>
    )
}

export default DriverManagementPage