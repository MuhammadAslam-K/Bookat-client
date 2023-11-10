
import Dashboard from "../../../components/driver/dashboard/Dashboard"
import Navbar from "../../../components/driver/common/Navbar"
import DriverFooter from "../../../components/driver/common/DriverFooter"


function DriverDashboardPage() {
    return (
        <div className="bg-gray-100 h-auto">
            <Navbar />
            <Dashboard />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </div>
    )
}

export default DriverDashboardPage