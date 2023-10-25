import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import driverApis from "../../../Constraints/apis/driverApis";
import { driverLogout, setDriverAvailable } from "../../../services/redux/slices/driverAuth";
import driverEndPoints from "../../../Constraints/endPoints/driverEndPoints";
import { ErrorResponse } from "../../user/UserProfile";
import { driverAxios } from "../../../Constraints/axiosInterceptors/driverAxiosInterceptors";

interface rideDetail {
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driver_id: string,
}

function DriverCurrentRides() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [rideDetails, setRideDetails] = useState<rideDetail>()

    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.get(driverApis.currentRide)
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


    const handleNavigateToMap = () => {
        if (rideDetails) {
            const data = {
                rideId: rideDetails._id,
            }
            const queryStringData = queryString.stringify(data);
            navigate(`${driverEndPoints.rideconfirm}?${queryStringData}`);
            dispatch(setDriverAvailable(false))

        }
    }

    return (
        <>
            {rideDetails ?
                <div className="flex h-screen justify-center mt-9" >
                    <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full ">
                            <div className="p-8">
                                <div className="p-8">
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
                                                    Map
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
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
                                                    <p className="cursor-pointer" onClick={() => handleNavigateToMap()}>Navigation</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                :
                <div className="flex h-screen items-center justify-center bg-gray-100" >
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full ">
                            <div className="p-8 text-center">
                                <h1 className="text-3xl font-black capitalize text-blue">Currently there is no on going ride</h1>
                            </div>
                        </div>
                    </div>
                </div>

            }

        </>
    )
}


export default DriverCurrentRides