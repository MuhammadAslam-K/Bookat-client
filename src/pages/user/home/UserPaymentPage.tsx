import UserNavbar from '../../../components/user/UserNavbar'
import Payment from '../../../components/user/Payment'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';

function UserPaymentPage() {
    const location = useLocation();
    const { userId } = queryString.parse(location.search) as {
        userId: string | null;
    };

    const data = { userId };
    return (
        <div className='bg-gray-100'>
            <UserNavbar />
            <Payment {...data} />
        </div>
    )
}

export default UserPaymentPage

