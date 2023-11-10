import { Suspense, lazy, useEffect, useState } from "react"
import { handleErrors } from "../../Constraints/apiErrorHandling"
import { adminAxios } from "../../Constraints/axiosInterceptors/adminAxiosInterceptors"
import adminApis from "../../Constraints/apis/adminApis"

const BarChart = lazy(() => import("../common/BarChart"))


interface dashboard {
    totalDriversCount: string
    totalQuickRidesCount: string
    totalRidesCount: string
    totalScheduledRidesCount: string
    totalUsersCount: string
    totalUsers: totalUsers[]
    totalDrivers: totalUsers[]
    totalQuickRides: rides[]
    totalScheduledRides: rides[]
}

interface totalUsers {
    joinedAt: string;
}
interface rides {
    date: string;
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

    // USER
    const userJoinDates = dashboard?.totalUsers.map((user) => {
        const joinedAt = new Date(user.joinedAt);
        return { month: joinedAt.getMonth(), year: joinedAt.getFullYear() };
    });

    const userCountsByMonth: { [key: string]: number } = {};
    userJoinDates?.forEach((joinDate) => {
        const key = `${joinDate.year}-${joinDate.month}`;
        userCountsByMonth[key] = (userCountsByMonth[key] || 0) + 1;
    });

    const userMonths = Object.keys(userCountsByMonth);
    const userCounts = Object.values(userCountsByMonth);

    // DRIVER
    const driverJoinDates = dashboard?.totalDrivers.map((driver) => {
        const joinedAt = new Date(driver.joinedAt);
        return { month: joinedAt.getMonth(), year: joinedAt.getFullYear() };
    });

    const driverCountsByMonth: { [key: string]: number } = {};
    driverJoinDates?.forEach((joinDate) => {
        const key = `${joinDate.year}-${joinDate.month}`;
        driverCountsByMonth[key] = (driverCountsByMonth[key] || 0) + 1;
    });

    const driverMonths = Object.keys(driverCountsByMonth);
    const driverCounts = Object.values(driverCountsByMonth);


    // QuickRide
    const quickRideDates = dashboard?.totalQuickRides.map((ride) => {
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
    const scheduledRideDates = dashboard?.totalScheduledRides.map((ride) => {
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
                <div className="w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-purple-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Total Users</h1>
                        <h1 className="text-4xl font-bold text-purple-500 text-center">
                            {dashboard?.totalUsersCount}
                        </h1>
                    </div>
                </div>

                <div className="w-full overflow-hidden rounded-lg bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out hover:bg-purple-200 mb-4 sm:w-auto sm:mb-0 sm:mx-4">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-gray-800 text-center">Total Drivers</h1>
                        <h1 className="text-4xl font-bold text-purple-500 text-center">
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


            </div>

            <div className="flex flex-col md:flex-row w-10/12 mx-auto mt-20 justify-center">
                <div className="w-full overflow-hidden rounded-3xl bg-blue-200 shadow-2xl sm:flex justify-center">
                    <div className="w-full flex flex-col md:flex-row items-center justify-around">
                        <div className="p-8">
                            <h1 className="text-3xl font-black mb-5 text-blue-900">Quick Rides</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={QuickRideMonths} userCounts={QuickRideCounts} />
                            </Suspense>
                        </div>
                        <div className="p-8">
                            <h1 className="text-3xl font-black mb-5 text-blue-900">Scheduled Rides</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={scheduledRideMonths} userCounts={scheduledRideCounts} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row w-10/12 mx-auto mt-20 justify-center">
                <div className="w-full overflow-hidden rounded-3xl bg-blue-200 shadow-2xl sm:flex justify-center">
                    <div className="w-full flex flex-col md:flex-row items-center justify-around">
                        <div className="p-8">
                            <h1 className="text-3xl font-black mb-5 text-blue-900">Users</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={userMonths} userCounts={userCounts} />
                            </Suspense>
                        </div>
                        <div className="p-8">
                            <h1 className="text-3xl font-black mb-5 text-blue-900">Drivers</h1>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BarChart months={driverMonths} userCounts={driverCounts} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Dashboard