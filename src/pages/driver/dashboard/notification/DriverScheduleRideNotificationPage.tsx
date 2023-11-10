import DriverFooter from '../../../../components/driver/common/Navbar'
import Navbar from '../../../../components/driver/common/DriverFooter'
import ScheduledRideNotification from '../../../../components/driver/notifications/ScheduledRideNotification'

function DriverScheduleRideNotificationPage() {
    return (
        <>
            <Navbar />
            <ScheduledRideNotification />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverScheduleRideNotificationPage