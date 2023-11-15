import Navbar from '../../../../components/driver/common/Navbar'
import DriverFooter from '../../../../components/driver/common/DriverFooter'
import Profile from "../../../../components/driver/Profile"

function DriverProfilePage() {
    return (
        <div className=" bg-gray-100">
            <Navbar />
            <Profile />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </div>
    )
}

export default DriverProfilePage