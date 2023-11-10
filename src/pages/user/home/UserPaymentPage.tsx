import UserNavbar from '../../../components/user/common/UserNavbar';
import Payment from '../../../components/user/Payment'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function UserPaymentPage() {
    const location = useLocation();
    const { rideId } = queryString.parse(location.search) as {
        rideId: string | null;
    };

    const data = { rideId };
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <Payment {...data} />
        </div>
    )
}

export default UserPaymentPage

