import VehicleInfo from '../../../../components/driver/VehicleInfo'
import Navbar from '../../../../components/driver/common/Navbar'
import DriverFooter from '../../../../components/driver/common/DriverFooter'

function DriverVehicleInfoPage() {
    return (
        <>
            <Navbar />
            <VehicleInfo />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverVehicleInfoPage