import Navbar from "../../../components/driver/common/Navbar"
import DriverFooter from "../../../components/driver/common/DriverFooter"
import AddVehicleInfo from '../../../components/driver/AddPersonalAndVehicleInfo/AddVehicleInfo'

function AddVehicleInfoPage() {
    return (
        <div className="bg-gray-100">
            <Navbar />
            <AddVehicleInfo />
            <DriverFooter />
        </div>
    )
}

export default AddVehicleInfoPage