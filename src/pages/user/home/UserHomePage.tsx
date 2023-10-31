import UserHome from '../../../components/user/home/UserHome'
// import UserFooter from '../../../components/user/UserFooter'
import UserNavbar from '../../../components/user/UserNavbar'

function UserHomePage() {
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <UserHome />
            {/* <UserFooter /> */}
        </div>
    )
}

export default UserHomePage