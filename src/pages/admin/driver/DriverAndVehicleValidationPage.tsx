import { useLocation } from 'react-router-dom';
import Navbar from '../../../components/cab/admin/AdminNavbar'
import DriverAndVehicleValidation from '../../../components/cab/admin/DriverAndVehicleValidation'

function DriverAndVehicleValidationPage() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('id');

    const data = { id: id }
    return (
        <>
            <Navbar />
            <DriverAndVehicleValidation {...data} />
        </>
    )
}

export default DriverAndVehicleValidationPage