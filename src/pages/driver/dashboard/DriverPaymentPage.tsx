
import DriverPayment from '../../../components/driver/DriverPayment';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Navbar from '../../../components/driver/Navbar';

function DriverPaymentPage() {
    const location = useLocation();
    const { rideId } = queryString.parse(location.search) as {
        rideId: string | null;
    };

    const data = { rideId };
    return (
        <div className='bg-gray-100'>
            <Navbar />
            <DriverPayment {...data} />
        </div>
    )
}

export default DriverPaymentPage