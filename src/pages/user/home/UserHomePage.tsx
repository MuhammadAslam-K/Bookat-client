import UserHome from '../../../components/user/UserHome'
import UserNavbar from '../../../components/user/UserNavbar'

function UserHomePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <UserHome />
        </div>
    )
}

export default UserHomePage