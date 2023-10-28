import { useEffect, useState } from 'react'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'
import { useDispatch } from 'react-redux'

import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors'
import userApis from '../../../Constraints/apis/userApis'
import { ErrorResponse } from '../profile/UserProfile'
import { userLogout } from '../../../services/redux/slices/userAuth'
import userEndPoints from '../../../Constraints/endPoints/userEndPoints'


interface feedback {
    feedback: string
    rating: string
    _id: string
}

interface driverData {
    name: string
    mobile: string
    email: string
    RideDetails: {
        completedRides: string
    },
    vehicleDocuments: {
        vehicleModel: string
        registration: {
            registrationId: string,
            registrationImage: string
        }
        vehicleImage1: string
        vehicleImage2: string
    }
    license: {
        licenseId: string
        licenseImage: string
    }
    joinedAt: string,
    driverImageUrl: string
}
function ScheduledRideConfirmedDriverInfo(props: { driverId: string | null, rideId: string | null }) {

    const { driverId, rideId } = props
    const navigator = useNavigate()
    const dispatch = useDispatch()

    const [driverInfo, setDriverInfo] = useState<driverData | null>(null);
    const [feedback, setFeedback] = useState<feedback[] | null>(null);


    useEffect(() => {
        if (driverId) {
            fetchDriverData(driverId)
        }
    }, [])

    const fetchDriverData = async (driverId: string) => {
        try {
            const response = await userAxios.get(`${userApis.getDriverData}?driverId=${driverId}`)
            console.log(response.data)
            setDriverInfo(response.data.driverData)
            setFeedback(response.data.feedBacks)

        } catch (error) {
            console.log("error in fetchDriverData", error)
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response?.data.error == 'jwt expired') {
                    toast.error(axiosError.response.data.error);
                    dispatch(userLogout())
                    navigator(userEndPoints.login)

                } else if (axiosError.response?.data.error) {
                    toast.error(axiosError.response.data.error)
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }


    const renderStars = (rating: string) => {
        const numberOfStars = parseInt(rating);
        if (numberOfStars >= 1 && numberOfStars <= 5) {
            return '⭐️'.repeat(numberOfStars);
        } else {
            return 'Invalid Rating';
        }
    }

    const handleCancelTheRide = async () => {
        try {
            const data = { driverId, rideId }
            await userAxios.post(userApis.cancelTheRide, data)
            toast.success("Cancelled the Ride SuccessFully")
            navigator(userEndPoints.home)

        } catch (error) {
            console.log("error in fetchComments", error)
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response?.data) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }

    return (
        <>
            <div className="flex my-10 justify-center space-x-4">

                <div className="w-10/12 space-y-4">
                    <div className='rounded-3xl shadow-2xl'>
                        <div className="flex">
                            {/* PERSONAL */}
                            <div className="w-4/12 m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                                <div className='flex justify-center'>
                                    <img className="rounded-t-lg mt-6" src={driverInfo?.driverImageUrl} alt="no" />
                                </div>
                                <div className="p-5">
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Name : {driverInfo?.name}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Mobile : {driverInfo?.mobile}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Email : {driverInfo?.email}</p>

                                </div>
                            </div>
                            {/* VEHICLE */}
                            <div className="w-4/12 m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                                <div className='flex justify-center'>
                                    <img className="rounded-t-lg mt-6" src={driverInfo?.vehicleDocuments.vehicleImage1} alt="no" />
                                </div>
                                <div className='flex justify-center'>
                                    <img className="rounded-t-lg mt-6" src={driverInfo?.vehicleDocuments.vehicleImage2} alt="no" />
                                </div>
                                <div className="p-5">
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Registration no : {driverInfo?.vehicleDocuments.registration.registrationId}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Vehicle : {driverInfo?.vehicleDocuments.vehicleModel}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Total Rides : {driverInfo?.RideDetails?.completedRides}</p>
                                </div>
                            </div>

                            {/* DOCUMENTS */}
                            <div className="w-4/12 m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                                <div className='flex justify-center'>
                                    <img className="rounded-t-lg mt-6" src={driverInfo?.vehicleDocuments.registration.registrationImage} alt="no" />
                                </div>
                                <div className='flex justify-center'>
                                    <img className="rounded-t-lg mt-6" src={driverInfo?.license.licenseImage} alt="no" />
                                </div>
                                <div className="p-5">
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">LicenseId : {driverInfo?.license.licenseId}</p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Vehicle : {driverInfo?.vehicleDocuments.vehicleModel}</p>
                                </div>
                            </div>

                        </div>

                        {/* REVIEW */}
                        <div className="overflow-x-auto p-5 scrollbar-hide" style={{ maxWidth: '100%' }}>
                            <div className="flex space-x-4">
                                {/* Review divs */}
                                {feedback?.map((item) => (
                                    <div key={item._id} className="-10 border rounded-3xl shadow-2xl p-4" style={{ flex: '0 0 auto', width: '20rem' }}>
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{renderStars(item.rating)}</h5>
                                        <p className="font-normal text-gray-700">{item.feedback}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <button type="button" onClick={handleCancelTheRide} className="m-5 mb-6 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 ">Cancel the Ride</button>
                    </div>
                </div>

            </div>
        </>
    )
}

export default ScheduledRideConfirmedDriverInfo

