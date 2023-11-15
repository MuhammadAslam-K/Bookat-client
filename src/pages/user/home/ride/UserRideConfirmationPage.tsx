import UserNavbar from '../../../../components/user/common/UserNavbar'
import UserFooter from '../../../../components/user/common/UserFooter'
import RideConfermation from '../../../../components/user/rides/CurrentRideInfo'
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
            <div className="mt-16">
                <UserFooter />
            </div>
        </div>
    );
}

export default UserRideConfirmationPage;
