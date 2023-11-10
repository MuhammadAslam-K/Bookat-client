import Navbar from "../../../components/admin/common/AdminNavbar"
import AdminFooter from "../../../components/admin/common/AdminFooter"
import DriverDataTable from "../../../components/admin/driver/DriverDataTable"

function DriverManagementPage() {

    return (
        <div className="bg-gray-100 h-auto">
            <Navbar />
            <DriverDataTable />
            <div className="mt-20">
                <AdminFooter />
            </div>
        </div>
    )
}

export default DriverManagementPage