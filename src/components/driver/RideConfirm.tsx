import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { rideDetails } from '../user/RideConfermation';
import driverApis from '../../Constraints/apis/driverApis';
import toast from 'react-hot-toast';
import { ErrorResponse } from '../user/UserProfile';
import axios, { AxiosError } from 'axios';
import { driverAxios } from '../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import userApis from '../../Constraints/apis/userApis';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import { Socket, io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { driverLogout, setDriverAvailable } from '../../services/redux/slices/driverAuth';
import driverEndPoints from '../../Constraints/endPoints/driverEndPoints';
import queryString from 'query-string';


interface userInfo {
    mobile: string
}
function RideConfirm(props: { rideId: string | null }) {

    const { rideId, } = props
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mapContainer = useRef<HTMLDivElement | null>(null);

    const [startLat, setStartLat] = useState<number | null>(null)
    const [startLong, setStartLong] = useState<number | null>(null)

    const [endLat, setEndLat] = useState<number | null>(null)
    const [endLong, setEndLong] = useState<number | null>(null)

    const [sendOTP, setSendOTP] = useState(false)
    const [OTPsuccess, setOTPsuccess] = useState(false)

    const [rideInfo, setRideInfo] = useState<rideDetails | null>(null);
    const [OTP, setOTP] = useState<string>("")

    const [mobile, setmobile] = useState<userInfo | null>(null)

    const [socket, setsocket] = useState<Socket | null>(null)
    const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);


    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.post(driverApis.getRideDetails, { rideId })
                setRideInfo(response.data)
                console.log("response :", response)

                setEndLong(parseInt(response.data.pickupCoordinates.longitude))
                setEndLat(parseInt(response.data.pickupCoordinates.latitude))

                await fetchUserData(response.data.user_id)
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


    const fetchUserData = async (userId: string) => {
        try {
            const response = await driverAxios.post(driverApis.getUserInfo, { id: userId });
            console.log("user data", response)
            setmobile(response.data.mobile)
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


    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setStartLong(position.coords.longitude);
                    setStartLat(position.coords.latitude);
                },
            );
        }

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        if (startLat && startLong && mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [startLong, startLat],
                zoom: 10,
            });
            setMap(map);

            // Add map directions control
            map.on('load', () => {
                const directions = new MapboxDirections({
                    accessToken: mapboxgl.accessToken,
                    unit: 'metric',
                    profile: 'mapbox/driving-traffic',
                    controls: {
                        inputs: false,
                        instructions: false,
                    },
                    route: true,
                });

                console.log("inside the map")
                map.addControl(directions, 'top-left');

                const startingPoint = [startLong, startLat];
                const endPoint = [endLong, endLat];

                directions.setOrigin(startingPoint);
                directions.setDestination(endPoint);
            })
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [endLat, endLong]);

    // SOCKET
    useEffect(() => {

        const socketClient = io(import.meta.env.VITE_SOCKET_PORT, {
            transports: ["websocket"]
        });
        setsocket(socketClient)

        if (socketClient) {
            socketClient.on('connect', () => {
                console.log('Connected to the Socket.IO server');
            })
        } else {
            console.log("Can not connect")
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };

    }, [])


    const handleSendOtp = async () => {
        try {
            const response = await driverAxios.post(userApis.sendOtp, { mobile })
            console.log("otp response", response)
        } catch (error) {
            console.log("handleSendOtp", error);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }


    const handleConfirmOTP = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const data = { otp: OTP, mobile: mobile }
            await userAxios.post(userApis.verifyOtp, data);
            toast.success("OTP success full")
            setOTPsuccess(true)

            if (socket) {
                const data = { userId: rideInfo?.user_id }
                socket.emit("startRide", data)
            }
            if (rideInfo) {
                setEndLat(parseInt(rideInfo.dropoffCoordinates.latitude))
                setEndLong(parseInt(rideInfo.dropoffCoordinates.longitude))
            }

        } catch (error) {
            console.log("handleConfirmOTP", error);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }

    const handleEndRide = () => {
        if (socket && rideInfo) {
            const data = { userId: rideInfo.user_id }
            socket.emit("endRide", data)

            const queryParams = rideId ? { rideId } : {};
            console.log("query params", queryParams)
            const queryStringData = queryString.stringify(queryParams);
            navigate(`${driverEndPoints.payment}?${queryStringData}`);
            dispatch(setDriverAvailable(true))
        }
    }

    return (
        <div className="flex my-10 justify-center space-x-4">

            <div className="w-10/12 space-y-4">
                <div className='rounded-3xl shadow-2xl'>
                    {/* {driverData && */}
                    <div className="flex">
                        <div className="w-9/12 m-10">
                            <div ref={mapContainer} style={{ width: '100%', height: '80vh' }} />
                        </div>
                        <div className="w-3/12 h-56  m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                            <div className="p-5 m-3">
                                {OTPsuccess ?
                                    <button
                                        onClick={handleEndRide}
                                    >End Ride</button>
                                    :
                                    <>
                                        {sendOTP ?
                                            <form onSubmit={handleConfirmOTP}>

                                                <input type="text"
                                                    className='pl-2 outline-none border-4 w-full rounded-lg p-2.5 sm:text-sm'
                                                    placeholder='Enter OTP'
                                                    value={OTP}
                                                    onChange={(e) => setOTP(e.target.value)}
                                                />
                                                <button className='m-2 bg-blue-500 p-2 border rounded-lg text-white' type="submit">Confirm OTP</button>
                                            </form>

                                            :
                                            <>
                                                <button
                                                    onClick={() => {
                                                        setSendOTP(true);
                                                        handleSendOtp();
                                                    }}
                                                >Start Ride</button>

                                            </>
                                        }
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default RideConfirm;