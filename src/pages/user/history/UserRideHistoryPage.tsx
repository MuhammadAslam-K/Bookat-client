import UserRideHistory from "../../../components/user/history/UserRideHistory"
import UserNavbar from "../../../components/user/UserNavbar"

function UserRideHistoryPage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <UserRideHistory />
        </div>
    )
}

export default UserRideHistoryPage