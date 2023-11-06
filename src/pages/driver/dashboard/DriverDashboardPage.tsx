
import Dashboard from "../../../components/driver/dashboard/Dashboard"
// import DriverFooter from "../../../components/driver/DriverFooter"
import Navbar from "../../../components/driver/Navbar"

function DriverDashboardPage() {
    return (
        <div className="bg-gray-100 h-screen">
            <Navbar />
            <Dashboard />
            {/* <div className="mt-20">
                <DriverFooter />
            </div> */}
        </div>
    )
}

export default DriverDashboardPage