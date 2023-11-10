import { useLocation } from 'react-router-dom';
import Navbar from '../../../../components/driver/common/Navbar'
import DriverFooter from '../../../../components/driver/common/DriverFooter'
import RideConfirm from '../../../../components/driver/rides/RideConfirm'
import queryString from 'query-string';

function DriverRideConfirmationPage() {
    const location = useLocation();
    const { rideId } = queryString.parse(location.search) as {
        rideId: string | null;
    };

    const data = { rideId };
    return (
        <>
            <Navbar />
            <RideConfirm {...data} />
            <div className="mt-20">
                <DriverFooter />
            </div>
        </>
    )
}

export default DriverRideConfirmationPage