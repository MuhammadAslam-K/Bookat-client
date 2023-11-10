import Navbar from "../../../components/admin/common/AdminNavbar"
import AdminFooter from "../../../components/admin/common/AdminFooter"
import ListAllCabs from '../../../components/admin/cab/ListAllCabs'

function ListAllCabsPage() {
    return (
        <div className='bg-gray-100 h-screen'>
            <Navbar />
            <ListAllCabs />
            <div className="mt-20">
                <AdminFooter />
            </div>
        </div>
    )
}

export default ListAllCabsPage