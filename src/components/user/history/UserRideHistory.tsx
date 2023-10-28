import { useEffect, useState } from 'react'
import { handleErrors } from '../../../Constraints/apiErrorHandling'
import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../../Constraints/apis/userApis';


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


function UserRideHistory() {


    const [quickRidesInfo, SetQuickRidesInfo] = useState<Ride[] | null>(null)
    const [scheduledRidesInfo, SetScheduledRidesInfo] = useState<Ride[] | null>(null)
    const [quickRides, SetQuickRides] = useState(true)

    useEffect(() => {
        fetchUserData()
    }, [])

    const current_tab = "cursor-pointer bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
    const pre_tab = "cursor-pointer border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"

    const fetchUserData = async () => {
        try {
            const response = await userAxios.get(userApis.getRideHistory)
            console.log("response", response)
            SetQuickRidesInfo(response.data.quickRides)
            SetScheduledRidesInfo(response.data.scheduledRides)
        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    return (
        <div>
            <div className="flex h-screen justify-center mt-9" >

                <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <div className="p-8">
                            </div>
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

                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                                <table className="w-full text-sm text-left text-white  dark:text-white">
                                    <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-slate-500 dark:text-white border-b-white border-4 font-bold">

                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                From
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                To
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Distance
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                status
                                            </th>
                                        </tr>
                                    </thead>

                                    {quickRides ?
                                        <tbody>
                                            {quickRidesInfo && quickRidesInfo.map((items) => (

                                                <tr key={items._id} className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                    <th scope="row"
                                                        className="px-6 py-4 max-w-xs font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white"
                                                        title={items.pickupLocation}
                                                    >
                                                        {items.pickupLocation}
                                                    </th>
                                                    <th scope="row"
                                                        className="px-6 py-4 max-w-xs font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white"
                                                        title={items.dropoffLocation}
                                                    >
                                                        {items.dropoffLocation}
                                                    </th>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        ₹ {items.price}
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        {items.distance} km
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        {items.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        :
                                        <tbody>
                                            {scheduledRidesInfo && scheduledRidesInfo.map((items) => (

                                                <tr key={items._id} className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                    <th scope="row"
                                                        className="px-6 py-4 max-w-xs font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white"
                                                        title={items.pickupLocation}
                                                    >
                                                        {items.pickupLocation}
                                                    </th>
                                                    <th scope="row"
                                                        className="px-6 py-4 max-w-xs font-medium text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis dark:text-white"
                                                        title={items.dropoffLocation}
                                                    >
                                                        {items.dropoffLocation}
                                                    </th>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        ₹ {items.price}
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        {items.distance} km
                                                    </td>
                                                    <td className="px-6 py-4 dark:text-white">
                                                        {items.status}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    }
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    )
}

export default UserRideHistory