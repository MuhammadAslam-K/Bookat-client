import UserNavbar from '../../../../components/user/UserNavbar'
import CurrentRide from '../../../../components/user/rides/CurrentRideTable'

function CurrentRidePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <CurrentRide />
        </div>
    )
}

export default CurrentRidePage