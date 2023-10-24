import RideHistory from "../../../components/user/history/RideHistory"
import UserNavbar from "../../../components/user/UserNavbar"

function RideHistoryPage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <RideHistory />
        </div>
    )
}

export default RideHistoryPage