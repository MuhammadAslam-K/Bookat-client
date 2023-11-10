import queryString from 'query-string';
import UserNavbar from '../../../../components/user/UserNavbar'
import ConfirmedDriverInfo from '../../../../components/user/rides/ScheduledRideConfirmedDriverInfo'
import { useLocation } from 'react-router';
import UserFooter from '../../../../components/user/UserFooter';

function UserSideDriverInfoPage() {
    const location = useLocation();
    const { driverId, rideId } = queryString.parse(location.search) as {
        driverId: string | null;
        rideId: string | null
    };

    const data = { driverId, rideId };
    return (
        <div >
            <UserNavbar />
            <ConfirmedDriverInfo {...data} />
            <div className="mt-16">
                <UserFooter />
            </div>
        </div>
    )
}

export default UserSideDriverInfoPage