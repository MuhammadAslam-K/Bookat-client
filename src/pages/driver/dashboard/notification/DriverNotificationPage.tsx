import DriverFooter from '../../../../components/driver/common/DriverFooter'
import Navbar from '../../../../components/driver/common/Navbar'
import Notification from '../../../../components/driver/notifications/Notification'

function DriverNotificationPage() {
    return (
        <>
            <Navbar />
            <Notification />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverNotificationPage