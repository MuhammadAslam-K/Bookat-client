import { useEffect, useState } from "react"
import { handleErrors } from "../../Constraints/apiErrorHandling"
import { adminAxios } from "../../Constraints/axiosInterceptors/adminAxiosInterceptors"
import adminApis from "../../Constraints/apis/adminApis"


interface dashboard {
    totalDriversCount: string
    totalQuickRidesCount: string
    totalRidesCount: string
    totalScheduledRidesCount: string
    totalUsersCount: string

}

function Dashboard() {

    const [dashboard, SetDashboard] = useState<dashboard | null>(null)

    useEffect(() => {
        const fetchAdminDashboardData = async () => {
            try {
                const response = await adminAxios.get(adminApis.dashboard)
                console.log(response)
                SetDashboard(response.data)
            } catch (error) {
                console.log(error)
                handleErrors(error)
            }
        }
        fetchAdminDashboardData()
    }, [])

    return (
        <div>
            <div className="flex flex-wrap justify-around m-10">
                <div className="max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mr-4">
                    <div className="p-8">
                        <h3 className="text-3xl font-black text-blue text-center">Users</h3>
                        <h3 className="text-3xl font-black text-blue text-center">{dashboard?.totalUsersCount}</h3>
                    </div>
                </div>

                <div className="max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Drivers</h1>
                        <h1 className="text-3xl font-black text-blue text-center">{dashboard?.totalDriversCount}</h1>
                    </div>
                </div>

                <div className="max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Quick Rides</h1>
                        <h1 className="text-3xl font-black text-blue text-center">{dashboard?.totalQuickRidesCount}</h1>
                    </div>
                </div>

                <div className="max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Scheduled Rides</h1>
                        <h1 className="text-3xl font-black text-blue text-center">{dashboard?.totalScheduledRidesCount}</h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard