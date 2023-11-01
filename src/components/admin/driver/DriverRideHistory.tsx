import { Suspense, useEffect, useState } from 'react'
import { handleErrors } from '../../../Constraints/apiErrorHandling'
import { adminAxios } from '../../../Constraints/axiosInterceptors/adminAxiosInterceptors'
import adminApis from '../../../Constraints/apis/adminApis'

import DataTable from "react-data-table-component"


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


function DriverRideHistory(props: { driverId: string }) {

    const { driverId } = props
    const [quickRidesInfo, SetQuickRidesInfo] = useState<Ride[]>([])
    const [scheduledRidesInfo, SetScheduledRidesInfo] = useState<Ride[]>()
    const [quickRides, SetQuickRides] = useState(true)

    useEffect(() => {
        fetchDriverRideHistory()
    }, [])

    const current_tab = "bg-gray-300 cursor-pointer  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
    const pre_tab = "border-gray-400 border-2 cursor-pointer text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"

    const fetchDriverRideHistory = async () => {
        try {
            const response = await adminAxios.post(adminApis.getDriverRideHistory, { driverId })
            console.log("response", response)
            SetQuickRidesInfo(response.data.quickRides)
            SetScheduledRidesInfo(response.data.scheduleRides)
        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

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
    )
}

export default DriverRideHistory