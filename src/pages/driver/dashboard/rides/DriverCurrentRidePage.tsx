import DriverFooter from '../../../../components/driver/DriverFooter'
import Navbar from '../../../../components/driver/Navbar'
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