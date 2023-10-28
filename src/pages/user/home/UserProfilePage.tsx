import UserNavbar from "../../../components/user/UserNavbar"
import UserProfile from "../../../components/user/profile/UserProfile"

function UserProfilePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <UserProfile />
        </div>
    )
}

export default UserProfilePage