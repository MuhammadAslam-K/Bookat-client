import { useEffect, useState } from "react"
// import ScheduledRidesChart from "./chart"

import driverApis from "../../../Constraints/apis/driverApis"
import { driverAxios } from "../../../Constraints/axiosInterceptors/driverAxiosInterceptors"
import { handleErrors } from "../../../Constraints/apiErrorHandling"

interface dashboard {
    driverData: {
        RideDetails: {
            completedRides: string
        },
        revenue: string
    }
    totalRide: string,
    quickRidesCount: string,
    scheduledRidesCount: string
}


function Dashboard() {

    const [dashboard, SetDashboard] = useState<dashboard | null>(null)

    useEffect(() => {
        const fetchDriverDashboardData = async () => {
            try {
                const response = await driverAxios.get(driverApis.dashboard)
                console.log("response", response)
                SetDashboard(response.data)
            } catch (error) {
                handleErrors(error)
            }
        }
        fetchDriverDashboardData()
    }, [])


    return (
        <div>
            <div className="flex flex-wrap justify-around m-10 cursor-pointer">
                <div className="w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-blue-200 mb-4 sm:w-auto sm:mb-0 sm:mr-4">
                    <div className="p-6">
                        <h3 className="text-3xl font-bold text-gray-800 text-center">Completed Rides</h3>
                        <h3 className="text-4xl font-bold text-blue-500 text-center">
                            {dashboard?.driverData.RideDetails.completedRides}
                        </h3>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-green-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Total Revenue</h1>
                        <h1 className="text-4xl font-bold text-green-500 text-center">
                            ₹ {parseInt(dashboard?.driverData.revenue ?? '0')}
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-purple-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Quick Rides</h1>
                        <h1 className="text-4xl font-bold text-purple-500 text-center">
                            {dashboard?.quickRidesCount}
                        </h1>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-yellow-200 sm:w-auto sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Scheduled Rides</h1>
                        <h1 className="text-4xl font-bold text-yellow-500 text-center">
                            {dashboard?.scheduledRidesCount}
                        </h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Dashboard