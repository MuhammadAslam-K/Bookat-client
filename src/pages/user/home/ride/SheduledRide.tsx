import UserFooter from '../../../../components/user/common/UserFooter'
import UserNavbar from '../../../../components/user/common/UserNavbar'
import ScheduledRides from '../../../../components/user/rides/ScheduledRides'

function SheduledRidePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <ScheduledRides />
            <div className="mt-16">
                <UserFooter />
            </div>
        </div>
    )
}

export default SheduledRidePage