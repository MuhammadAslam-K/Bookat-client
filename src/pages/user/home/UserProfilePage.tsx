import UserFooter from "../../../components/user/common/UserFooter"
import UserNavbar from "../../../components/user/common/UserNavbar"
import UserProfile from "../../../components/user/profile/UserProfile"

function UserProfilePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <UserProfile />
            <UserFooter />
        </div>
    )
}

export default UserProfilePage