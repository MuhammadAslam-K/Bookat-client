import { Suspense, useEffect, useState } from 'react'
import { handleErrors } from '../../../Constraints/apiErrorHandling'
import { adminAxios } from '../../../Constraints/axiosInterceptors/adminAxiosInterceptors'
import adminApis from '../../../Constraints/apis/adminApis'

import DataTable from "react-data-table-component"
import BarChart from '../../common/BarChart'


interface Ride {
    _id: string;
    status: string;
    date: string;
    distance: string;
    dropoffLocation: string;
    pickupLocation: string;
    price: number;
    rating: number;
}


function UserDetails(props: { userId: string }) {

    const { userId } = props
    const [quickRidesInfo, SetQuickRidesInfo] = useState<Ride[]>([])
    const [scheduledRidesInfo, SetScheduledRidesInfo] = useState<Ride[] | null>(null)
    const [quickRides, SetQuickRides] = useState(true)

    useEffect(() => {
        fetchUserData()
    }, [])

    const current_tab = "cursor-pointer bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
    const pre_tab = "cursor-pointer border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"

    const fetchUserData = async () => {
        try {
            const response = await adminAxios.patch(`${adminApis.getUserRideHistory}?id=${userId}`)
            console.log("response", response)
            SetQuickRidesInfo(response.data.quickRides)
            SetScheduledRidesInfo(response.data.scheduledRides)
        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    // QuickRide
    const quickRideDates = quickRidesInfo.map((ride) => {
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
    const scheduledRideDates = scheduledRidesInfo?.map((ride) => {
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


    const columns = [

        {
            name: 'From',
            selector: (row: Ride) => row.pickupLocation,
        },
        {
            name: 'To',
            selector: (row: Ride) => row.dropoffLocation,
        },
        {
            name: 'Amount',
            selector: (row: Ride) => row.price,
        },
        {
            name: 'Distance',
            selector: (row: Ride) => row.distance,
        },
        {
            name: 'Status',
            selector: (row: Ride) => row.status,
        },

    ]

    return (
        <>
            <div className="mt-10 w-10/12 ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center">
                <div className="border-b border-gray-200">
                    <ul className="flex" role="tablist">
                        <li className="mr-1">
                            <p
                                onClick={() => SetQuickRides(true)}
                                className={quickRides ? current_tab : pre_tab}
                                role="tab"
                                aria-selected="true"
                            >
                                Quick Rides
                            </p>
                        </li>

                        <li className="mr-1">
                            <p onClick={() => SetQuickRides(false)}
                                className={quickRides ? pre_tab : current_tab}
                                role="tab"
                                aria-selected="true"
                            >
                                Scheduled Rides
                            </p>
                        </li>

                    </ul>
                </div>

                {quickRides ?
                    <Suspense>
                        <DataTable
                            style={{ zIndex: '-1' }}
                            columns={columns}
                            data={quickRidesInfo}
                            fixedHeader
                            highlightOnHover
                            pagination
                        />
                    </Suspense>
                    :

                    <Suspense>
                        {scheduledRidesInfo &&
                            <DataTable
                                style={{ zIndex: '-1' }}
                                columns={columns}
                                data={scheduledRidesInfo}
                                fixedHeader
                                highlightOnHover
                                pagination
                            />
                        }
                    </Suspense>
                }
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
        </>
    )
}

export default UserDetails