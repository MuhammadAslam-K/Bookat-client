import Navbar from "../../components/admin/common/AdminNavbar"
import AdminFooter from "../../components/admin/common/AdminFooter"
import Dashboard from "../../components/admin/Dashboard"

function AdminDashboardPage() {
    return (
        <div className="bg-gray-100 ">
            <Navbar />
            <Dashboard />
            <div className="mt-56">
                <AdminFooter />
            </div>
        </div>
    )
}

export default AdminDashboardPage