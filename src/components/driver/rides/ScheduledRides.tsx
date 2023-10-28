import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import driverApis from "../../../Constraints/apis/driverApis";
import { driverLogout, setDriverAvailable } from "../../../services/redux/slices/driverAuth";
import driverEndPoints from "../../../Constraints/endPoints/driverEndPoints";
import { ErrorResponse } from "../../user/profile/UserProfile";
import { driverAxios } from "../../../Constraints/axiosInterceptors/driverAxiosInterceptors";
import queryString from "query-string";

interface rideDetail {
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driver_id: string,
}

function ScheduledRides() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rideDetails, setRideDetails] = useState<rideDetail>()

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.get(driverApis.scheduleRidePending)
                console.log("response", response)
                setRideDetails(response.data[0])
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


    const handleStartRide = async (rideId: string) => {
        try {
            await driverAxios.patch(driverApis.startScheduledRide, { rideId })

            if (rideDetails) {
                const data = {
                    rideId: rideDetails._id,
                }
                const queryStringData = queryString.stringify(data);
                navigate(`${driverEndPoints.rideconfirm}?${queryStringData}`);
                dispatch(setDriverAvailable(false))
            }
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
                            <div className="p-8">
                            </div>
                            <div className="border-b border-gray-200">
                                <ul className="flex" role="tablist">
                                    <li className="mr-1">
                                        <Link
                                            to={driverEndPoints.currentRide}
                                            role="tab"
                                            className="border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
                                            aria-selected="true"
                                        >
                                            Rides
                                        </Link>
                                    </li>

                                    <li className="mr-1">
                                        <Link
                                            to={driverEndPoints.pendingScheduledRides}
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
                                                status
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rideDetails &&
                                            <tr key={rideDetails._id} className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {rideDetails.pickupLocation}
                                                </th>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.dropoffLocation}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    ₹ {rideDetails.price}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.distance} km
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.status}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    <p className="cursor-pointer" onClick={() => handleStartRide(rideDetails._id)}>Start</p>
                                                </td>
                                            </tr>
                                        }
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


export default ScheduledRides