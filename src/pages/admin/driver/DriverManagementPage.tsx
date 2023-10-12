import Navbar from "../../../components/admin/AdminNavbar"
import DataTable from "../../../components/admin/DataTable"
import adminEndPoints from "../../../endpoints/adminEndPoints"

function DriverManagementPage() {
    const data = {
        blockEndpoint: adminEndPoints.blockDriver,
        getData: adminEndPoints.getDriversData,
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