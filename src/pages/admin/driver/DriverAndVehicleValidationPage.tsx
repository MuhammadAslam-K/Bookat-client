import { useLocation } from 'react-router-dom';
import Navbar from '../../../components/admin/AdminNavbar'
import DriverAndVehicleValidation from '../../../components/admin/driver/DriverAndVehicleValidation'
import AdminFooter from '../../../components/admin/AdminFooter';

function DriverAndVehicleValidationPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = { id: id }
    return (
        <div className='bg-gray-100'>
            <Navbar />
            <DriverAndVehicleValidation {...data} />
            <div className="mt-20">
                <AdminFooter />
            </div>
        </div>
    )
}

export default DriverAndVehicleValidationPage