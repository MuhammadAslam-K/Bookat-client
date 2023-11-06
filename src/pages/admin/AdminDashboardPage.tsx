import AdminFooter from "../../components/admin/AdminFooter"
import Navbar from "../../components/admin/AdminNavbar"
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