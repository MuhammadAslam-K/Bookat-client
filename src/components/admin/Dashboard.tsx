import { useEffect, useState } from "react"
import { handleErrors } from "../../Constraints/apiErrorHandling"
import { adminAxios } from "../../Constraints/axiosInterceptors/adminAxiosInterceptors"
import adminApis from "../../Constraints/apis/adminApis"

// const PieChart = lazy(() => import("./chart/PieChart"))
// const Barchart = lazy(() => import("./chart/BarChart"))


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


    // const pieChartData = [
    //     { title: `Quick Rides`, value: parseInt(dashboard?.totalQuickRidesCount ?? '0'), color: '#FF5733' },
    //     { title: `Scheduled Rides`, value: parseInt(dashboard?.totalScheduledRidesCount ?? '0'), color: '#FFC300' },
    // ];


    return (
        <div>
            <div className="flex flex-wrap justify-around m-10 cursor-pointer">
                <div className="w-2/3 overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-blue-200 mb-4 sm:w-auto sm:mb-0 sm:mr-4">
                    <div className="p-6">
                        <h3 className="text-3xl font-bold text-gray-800 text-center">Total Users</h3>
                        <h3 className="text-4xl font-bold text-blue-500 text-center">
                            {dashboard?.totalUsersCount}
                        </h3>
                    </div>
                </div>

                <div className="w-2/3 overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-green-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Total Drivers</h1>
                        <h1 className="text-4xl font-bold text-green-500 text-center">
                            {dashboard?.totalDriversCount}
                        </h1>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-purple-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Quick Rides</h1>
                        <h1 className="text-4xl font-bold text-purple-500 text-center">
                            {dashboard?.totalQuickRidesCount}
                        </h1>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-yellow-200 sm:w-auto sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Scheduled Rides</h1>
                        <h1 className="text-4xl font-bold text-yellow-500 text-center">
                            {dashboard?.totalScheduledRidesCount}
                        </h1>
                    </div>
                </div>



                {/* <div className="flex w-10/12 mt-20 justify-center">
                    <div className="w-full overflow-hidden rounded-3xl bg-blue-200 shadow-2xl sm:flex justify-center">
                        <div className="w-full flex items-center justify-center">
                            <div className="p-8">
                                <h1 className="text-3xl font-black text-blue-900">Rides</h1>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <PieChart data={pieChartData} />
                                </Suspense>
                            </div>
                            <div className="p-8">
                                <h1 className="text-3xl font-black text-blue-900">Rides</h1>
                            </div>
                        </div>
                    </div>
                </div> */}

            </div>




        </div>
    )
}

export default Dashboard