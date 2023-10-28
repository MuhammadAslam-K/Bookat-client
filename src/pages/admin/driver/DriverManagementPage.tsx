import Navbar from "../../../components/admin/AdminNavbar"
import DriverDataTable from "../../../components/admin/driver/DriverDataTable"

function DriverManagementPage() {

    return (
        <div className="bg-gray-100">
            <Navbar />
            <DriverDataTable />
        </div>
    )
}

export default DriverManagementPage