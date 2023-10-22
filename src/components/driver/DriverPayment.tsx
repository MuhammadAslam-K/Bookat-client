import React, { useEffect, useState } from 'react'
import { rideDetails } from './Notification';
import { driverAxios } from '../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import driverApis from '../../Constraints/apis/driverApis';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../user/UserProfile';
import toast from 'react-hot-toast';
import { driverLogout } from '../../services/redux/slices/driverAuth';
import driverEndPoints from '../../Constraints/endPoints/driverEndPoints';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function DriverPayment(props: { rideId: string | null }) {

    const { rideId } = props
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [rideInfo, setRideInfo] = useState<rideDetails | null>(null);


    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.post(driverApis.getRideDetails, { rideId })
                setRideInfo(response.data)
                console.log("response ", response)

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



    return (
        <div>DriverPayment</div>
    )
}

export default DriverPayment