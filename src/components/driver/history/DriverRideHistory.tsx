import { Suspense, useEffect, useState } from 'react'
import { handleErrors } from '../../../Constraints/apiErrorHandling'
import { driverAxios } from '../../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import driverApis from '../../../Constraints/apis/driverApis';
import { driverRideHistory } from '../../../interfaces/admin';

import DataTable from "react-data-table-component"




function DriverRideHistory() {


    const [quickRidesInfo, SetQuickRidesInfo] = useState<driverRideHistory[]>([])
    const [scheduledRidesInfo, SetScheduledRidesInfo] = useState<driverRideHistory[] | null>(null)
    const [quickRides, SetQuickRides] = useState(true)

    useEffect(() => {
        fetchUserData()
    }, [])

    const current_tab = "cursor-pointer bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
    const pre_tab = "cursor-pointer border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"

    const fetchUserData = async () => {
        try {
            const response = await driverAxios.get(driverApis.getRideHistory)
            console.log("response", response)
            SetQuickRidesInfo(response.data.quickRides)
            SetScheduledRidesInfo(response.data.scheduledRides)
        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    const columns = [

        {
            name: 'From',
            selector: (row: driverRideHistory) => row.pickupLocation,
        },
        {
            name: 'To',
            selector: (row: driverRideHistory) => row.dropoffLocation,
        },
        {
            name: 'Amount',
            selector: (row: driverRideHistory) => row.driverRevenu.toFixed(0),
        },
        {
            name: 'Distance',
            selector: (row: driverRideHistory) => row.distance,
        },
        {
            name: 'Status',
            selector: (row: driverRideHistory) => row.status,
        },

    ]

    return (
        <div className="mt-10 lg:w-10/12 w-full lg:ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center">
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