import Navbar from '../../../components/admin/AdminNavbar'
import ListAllCabs from '../../../components/admin/cab/ListAllCabs'

function ListAllCabsPage() {
    return (
        <div className='bg-gray-100 h-screen'>
            <Navbar />
            <ListAllCabs />
        </div>
    )
}

export default ListAllCabsPage