import UserNavbar from '../../../../components/user/UserNavbar'
import ScheduledRides from '../../../../components/user/rides/ScheduledRides'

function SheduledRidePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <ScheduledRides />
        </div>
    )
}

export default SheduledRidePage