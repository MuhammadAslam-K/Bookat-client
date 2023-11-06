import DriverFooter from '../../../../components/driver/DriverFooter'
import Navbar from '../../../../components/driver/Navbar'
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