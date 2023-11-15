import { Suspense, useEffect, useState } from "react"

import driverApis from "../../../Constraints/apis/driverApis"
import { driverAxios } from "../../../Constraints/axiosInterceptors/driverAxiosInterceptors"
import { handleErrors } from "../../../Constraints/apiErrorHandling"
import BarChart from "../../common/BarChart"
import { AdminDashboard } from "../../../interfaces/admin"



function Dashboard() {

    const [dashboard, SetDashboard] = useState<AdminDashboard | null>(null)

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

    // QuickRide
    const quickRideDates = dashboard?.quickRides.map((ride) => {
        const date = new Date(ride.date);
        return { month: date.getMonth(), year: date.getFullYear() };
    });

    const quickRideCountsByMonth: { [key: string]: number } = {};
    quickRideDates?.forEach((joinDate) => {
        const key = `${joinDate.year}-${joinDate.month}`;
        quickRideCountsByMonth[key] = (quickRideCountsByMonth[key] || 0) + 1;
    });

    const QuickRideMonths = Object.keys(quickRideCountsByMonth);
    const QuickRideCounts = Object.values(quickRideCountsByMonth);


    // Scheduled Ride
    const scheduledRideDates = dashboard?.scheduledRides.map((ride) => {
        const date = new Date(ride.date);
        return { month: date.getMonth(), year: date.getFullYear() };
    });

    const scheduledRideCountsByMonth: { [key: string]: number } = {};
    scheduledRideDates?.forEach((date) => {
        const key = `${date.year}-${date.month}`;
        scheduledRideCountsByMonth[key] = (scheduledRideCountsByMonth[key] || 0) + 1;
    });

    const scheduledRideMonths = Object.keys(scheduledRideCountsByMonth);
    const scheduledRideCounts = Object.values(scheduledRideCountsByMonth);




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

            <div className="flex flex-col md:flex-row w-10/12 mx-auto mt-20 justify-center">
                <div className="w-full overflow-hidden rounded-3xl bg-blue-200 shadow-2xl sm:flex justify-center">
                    <div className="w-full flex flex-col md:flex-row items-center justify-around">
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue-900">Quick Rides</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={QuickRideMonths} userCounts={QuickRideCounts} />
                            </Suspense>
                        </div>
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue-900">Scheduled Rides</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={scheduledRideMonths} userCounts={scheduledRideCounts} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Dashboard