import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { driverAxios } from "../../../Constraints/axiosInterceptors/driverAxiosInterceptors";
import driverApis from "../../../Constraints/apis/driverApis";
import { ErrorResponse } from "../../user/UserProfile";
import { driverLogout } from "../../../services/redux/slices/driverAuth";
import driverEndPoints from "../../../Constraints/endPoints/driverEndPoints";

interface rideDetails {
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driverAccepted: string,
    pickUpDate: string
    vehicleType: string
}

function ScheduledRideNotification() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rideDetails, setRideDetails] = useState<rideDetails[]>()

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.get(driverApis.scheduleRideNotification)
                console.log("response", response)
                setRideDetails(response.data)
            } catch (error) {
                console.log(error)
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response?.data) {
                        toast.error(axiosError.response.data.error);
                        dispatch(driverLogout())
                        navigate(driverEndPoints.login)
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchRideDetails()
    }, [])

    function formatDate(dateString: string | number | Date) {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US');

        return `${formattedDate} ${formattedTime}`;
    }

    const handleAcceptScheduledRide = async (rideId: string) => {
        try {
            const response = await driverAxios.post(driverApis.scheduleRideConfirmation, { rideId })
            console.log("response", response)
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response?.data) {
                    toast.error(axiosError.response.data.error);
                    dispatch(driverLogout())
                    navigate(driverEndPoints.login)
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }


    return (
        <>
            <div className="flex h-screen justify-center mt-9" >

                <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">

                            <div className="border-b border-gray-200">
                                <ul className="flex" role="tablist">
                                    <li className="mr-1">
                                        <Link
                                            to={driverEndPoints.rideNotification}
                                            className="border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
                                            role="tab"
                                            aria-selected="true"
                                        >
                                            Rides
                                        </Link>
                                    </li>

                                    <li className="mr-1">
                                        <Link
                                            to={""}
                                            className="bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
                                            role="tab"
                                            aria-selected="true"
                                        >
                                            Scheduled Rides
                                        </Link>
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
                                                Date and Time
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Vehicle Type
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rideDetails && rideDetails.map((items) => (

                                            <tr key={items._id} className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {items.pickupLocation}
                                                </th>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.dropoffLocation}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    ₹ {items.price}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.distance} km
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {formatDate(items.pickUpDate)}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.vehicleType}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    <p className="p-2 bg-green-500 rounded-xl mb-2 cursor-pointer"
                                                        onClick={() => handleAcceptScheduledRide(items._id)}
                                                    >Accept</p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ScheduledRideNotification