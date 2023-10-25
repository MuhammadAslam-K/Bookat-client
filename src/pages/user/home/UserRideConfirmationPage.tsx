import UserNavbar from '../../../components/user/UserNavbar'
import RideConfermation from '../../../components/user/rides/RideConfermation'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function UserRideConfirmationPage() {
    const location = useLocation();
    const { rideId } = queryString.parse(location.search) as {
        rideId: string | null;
    };

    const data = { rideId };

    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <RideConfermation {...data} />
        </div>
    );
}

export default UserRideConfirmationPage;
