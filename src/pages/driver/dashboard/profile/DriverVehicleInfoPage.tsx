import VehicleInfo from '../../../../components/driver/VehicleInfo'
import Navbar from '../../../../components/driver/Navbar'
import DriverFooter from '../../../../components/driver/DriverFooter'

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