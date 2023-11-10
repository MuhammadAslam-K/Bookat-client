import Navbar from '../../../../components/driver/common/Navbar'
import DriverFooter from '../../../../components/driver/common/DriverFooter'
import DriverCurrentRides from '../../../../components/driver/rides/DriverCurrentRides'

function DriverCurrentRidePage() {
    return (
        <>
            <Navbar />
            <DriverCurrentRides />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverCurrentRidePage