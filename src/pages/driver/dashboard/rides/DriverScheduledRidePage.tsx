import Navbar from '../../../../components/driver/common/Navbar'
import DriverFooter from '../../../../components/driver/common/DriverFooter'
import ScheduledRides from '../../../../components/driver/rides/ScheduledRides'

function DriverScheduledRidePage() {
    return (
        <>
            <Navbar />
            <ScheduledRides />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverScheduledRidePage