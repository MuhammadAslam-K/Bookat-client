import UserRideHistory from "../../../components/user/history/UserRideHistory"
import UserFooter from "../../../components/user/common/UserFooter"
import UserNavbar from "../../../components/user/common/UserNavbar"

function UserRideHistoryPage() {
    return (
        <div className='bg-gray-100 h-screen'>
            <UserNavbar />
            <UserRideHistory />
            <div className="mt-16">
                <UserFooter />
            </div>
        </div>
    )
}

export default UserRideHistoryPage