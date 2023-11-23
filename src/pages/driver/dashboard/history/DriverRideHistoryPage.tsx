import DriverFooter from '../../../../components/driver/common/DriverFooter'
import Navbar from '../../../../components/driver/common/Navbar'
import DriverRideHistory from "../../../../components/driver/history/DriverRideHistory"

function DriverRideHistoryPage() {
    return (
        <div className=" bg-gray-100">
            <Navbar />
            <DriverRideHistory />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </div>
    )
}

export default DriverRideHistoryPage