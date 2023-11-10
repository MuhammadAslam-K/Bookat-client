import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { rideDetails } from '../../user/rides/CurrentRideInfo';
import driverApis from '../../../Constraints/apis/driverApis';
import toast from 'react-hot-toast';
import { driverAxios } from '../../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import { Socket, io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setDriverAvailable } from '../../../services/redux/slices/driverAuth';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';
import { handleErrors } from '../../../Constraints/apiErrorHandling';

const ChatModal = lazy(() => import("../../common/Chat"))


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

    const [paymentModal, SetPaymentModal] = useState(false)
    const [chat, SetChat] = useState(false)


    useEffect(() => {
        const fetchRideDetails = async () => {
            try {
                const response = await driverAxios.patch(`${driverApis.getRideDetails}?id=${rideId}`)
                console.log("RIDE ", response)
                setRideInfo(response.data)
                if (response.data.otpVerifyed) {
                    setOTPsuccess(true)
                    setEndLong(parseFloat(response.data.dropoffCoordinates.longitude))
                    setEndLat(parseFloat(response.data.dropoffCoordinates.latitude))
                } else {
                    console.log(61)
                    setEndLong(parseFloat(response.data.pickupCoordinates.longitude))
                    setEndLat(parseFloat(response.data.pickupCoordinates.latitude))
                }

                await fetchUserData(response.data.user_id)
            } catch (error) {
                console.log(error)
                handleErrors(error)
            }
        }
        fetchRideDetails()
    }, [])


    const fetchUserData = async (id: string) => {
        try {
            const response = await driverAxios.patch(`${driverApis.getUserInfo}?id=${id}`);
            console.log("user data", response)
            setmobile(response.data.mobile)
        } catch (error) {
            console.log(error)
            handleErrors(error)
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
                socketClient.disconnect();
            }
        };

    }, [])


    const handleSendOtp = async () => {
        try {
            const response = await driverAxios.post(driverApis.sendOtp, { mobile })
            console.log("otp response", response)
        } catch (error) {
            console.log("handleSendOtp", error);
            handleErrors(error)
        }
    }


    const handleConfirmOTP = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        try {
            const data = { otp: OTP, mobile: mobile, rideId }
            await driverAxios.post(driverEndPoints.rideOtpVerify, data);
            toast.success("OTP success full")
            setOTPsuccess(true)

            if (socket) {
                const data = { userId: rideInfo?.user_id }
                socket.emit("startRide", data)
            }
            if (rideInfo) {
                setEndLat(parseFloat(rideInfo.dropoffCoordinates.latitude))
                setEndLong(parseFloat(rideInfo.dropoffCoordinates.longitude))
            }

        } catch (error) {
            console.log("handleConfirmOTP", error);
            handleErrors(error)
        }
    }

    const handleEndRide = () => {
        if (socket && rideInfo) {
            const data = { userId: rideInfo.user_id }
            socket.emit("endRide", data)
            dispatch(setDriverAvailable(true))
            SetPaymentModal(true)
        }
    }

    const handleChangeTheChatState = () => {
        SetChat(!chat)
    }

    const handleCompletedPayment = () => {
        navigate(driverEndPoints.dashboard)
    }

    return (
        <div className="flex flex-col items-center my-10 space-y-4">

            <div className='w-full sm:w-10/12 md:w-10/12 lg:w-10/12 xl:w-10/12 space-y-4'>
                <div className='rounded-3xl shadow-2xl'>
                    {paymentModal &&
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                            <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                                <h1 className='text-center font-semibold text-2xl'>Payment</h1>
                                <p className='text-center my-3 font-semibold'>Amount: {rideInfo?.price}</p>
                                <p className='max-w-sm'>Your professionalism and friendly demeanor make our riders' experiences memorable. We appreciate your hard work and the important role you play in our community.</p>

                                <button type='button' onClick={handleCompletedPayment} className='p-2 px-3 border border-slate-600 rounded-lg text-center ms-24 m-2'>Completed the Payment</button>

                            </div>
                        </div>
                    }

                    {/* Chat */}
                    {chat && rideId && socket &&
                        <Suspense fallback="loading please wait.....">
                            <ChatModal rideId={rideId} role={"driver"} handleChangeTheChatState={handleChangeTheChatState} />
                        </Suspense>
                    }

                    {/* {driverData && */}
                    <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-full m-10">
                            <div ref={mapContainer} style={{ width: '100%', height: '80vh' }} />
                        </div>
                        <div className="sm:w-full h-56 m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow-2xl">
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
                            <div>
                                <div className="flex">
                                    <button
                                        onClick={() => handleChangeTheChatState()}
                                        className="bg-blue-500 mx-auto hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 transition duration-300 ease-in-out focus:outline-none"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 transform rotate-90"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M2.293 8.293a1 1 0 011.414 0L10 14.586l6.293-6.293a1 1 0 111.414 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span>Chat</span>
                                    </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    );
}

export default RideConfirm;
