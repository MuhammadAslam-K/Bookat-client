import { useLocation } from 'react-router-dom';
import Navbar from '../../../components/driver/Navbar'
import RideConfirm from '../../../components/driver/rides/RideConfirm'
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
        </>
    )
}

export default DriverRideConfirmationPage