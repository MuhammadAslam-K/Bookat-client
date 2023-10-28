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
            <div className="flex flex-wrap justify-around m-10">
                <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mr-4">
                    <div className="p-8">
                        <h3 className="text-3xl font-black text-blue text-center">Rides</h3>
                        <h3 className="text-3xl font-black text-blue text-center">{dashboard?.driverData.RideDetails.completedRides}</h3>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Revenue</h1>
                        <h1 className="text-3xl font-black text-blue text-center">₹ {dashboard?.driverData.revenue}</h1>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Quick Rides</h1>
                        <h1 className="text-3xl font-black text-blue text-center">{dashboard?.quickRidesCount}</h1>
                    </div>
                </div>

                <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl sm:w-auto sm:mx-4">
                    <div className="p-8">
                        <h1 className="text-3xl font-black text-blue text-center">Scheduled Rides</h1>
                        <h1 className="text-3xl font-black text-blue text-center">{dashboard?.scheduledRidesCount}</h1>
                    </div>
                </div>
            </div>



        </div>
    )
}

export default Dashboard