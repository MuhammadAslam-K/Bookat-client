import Navbar from "../../../components/driver/common/Navbar"
import DriverFooter from "../../../components/driver/common/DriverFooter"
import AddPersonalInfo from "../../../components/driver/AddPersonalAndVehicleInfo/AddPersonalInfo"

function AddPersonlInfoPage() {
    return (
        <div className="bg-gray-100">
            <Navbar />
            <AddPersonalInfo />
            <DriverFooter />
        </div>
    )
}

export default AddPersonlInfoPage