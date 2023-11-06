import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { toast } from 'react-hot-toast';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import axios, { AxiosError } from 'axios';
import { userLogout } from '../../../services/redux/slices/userAuth';
import userEndPoints from '../../../Constraints/endPoints/userEndPoints';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ErrorResponse } from '../profile/UserProfile';
import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../../Constraints/apis/userApis';
import { Socket, io } from 'socket.io-client';
import queryString from 'query-string';
import { handleErrors } from '../../../Constraints/apiErrorHandling';



interface driverData {
    name: string
    // totalRides: string,
    RideDetails: {
        completedRides: string
    },
    vehicleDocuments: {
        vehicleModel: string
        registration: {
            registrationId: string
        }
    }
    joinedAt: string,
    driverImageUrl: string
}

export interface rideDetails {
    _id: string;
    driver_id: string;
    user_id: string;
    driverCoordinates: {
        latitude: string;
        longitude: string;
    };
    dropoffCoordinates: {
        latitude: string;
        longitude: string;
    };
    pickupCoordinates: {
        latitude: string;
        longitude: string;
    };
    dropoffLocation: string;
    pickupLocation: string;
    price: string;
    distance: string;
    otpVerifyed: boolean
}

interface commnet {
    feedback: string
    rating: string
}

function CurrentRideInfo(props: { rideId: string | null }) {

    const { rideId } = props

    const [startLat, setStartLat] = useState<number | null>(null)
    const [startLong, setStartLong] = useState<number | null>(null)

    const [endLat, setEndLat] = useState<number | null>(null)
    const [endLong, setEndLong] = useState<number | null>(null)

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);
    const [driverInfo, setDriverInfo] = useState<driverData | null>(null);
    const [rideInfo, setRideInfo] = useState<rideDetails | null>(null);
    const [feedback, setFeedback] = useState<commnet[] | null>(null);

    const [socket, setsocket] = useState<Socket | null>(null)


    const dispatch = useDispatch();
    const navigate = useNavigate()


    useEffect(() => {

        const fetchRideDetails = async () => {
            try {
                const response = await userAxios.patch(`${userApis.getRideDetails}?id=${rideId}`)
                console.log("response", response)
                setRideInfo(response.data)
                socketConnection()
                if (response.data.otpVerifyed) {
                    setEndLat(parseInt(response.data.dropoffCoordinates.latitude))
                    setEndLong(parseInt(response.data.dropoffCoordinates.longitude))
                }
                else {
                    setEndLong(parseInt(response.data.driverCoordinates.longitude))
                    setEndLat(parseInt(response.data.driverCoordinates.latitude))
                }

                fetchDriverData(response.data.driver_id)
            } catch (error) {
                console.log(error)
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response?.data) {
                        toast.error(axiosError.response.data.error);
                        dispatch(userLogout())
                        navigate(userEndPoints.login)
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchRideDetails()


    }, [])


    // MAP
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setStartLat(position.coords.latitude)
                    setStartLong(position.coords.longitude)
                },
                function (error) {
                    toast.error("Error getting location");
                    console.error('Error getting location:', error.message);
                }
            );
        }

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;


        if (startLong && startLat && mapContainer.current) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [startLong, startLat],
                zoom: 10,
            });
            setMap(map)

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

                map.addControl(directions, 'top-left');

                const startingPoint = [startLong, startLat];
                const endPoint = [endLong, endLat];

                directions.setOrigin(startingPoint);
                directions.setDestination(endPoint);
            });

        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [endLat, endLong])


    // SOCKET
    // useEffect(() => {

    //     const socketClient = io(import.meta.env.VITE_SOCKET_PORT, {
    //         transports: ["websocket"]
    //     });
    //     setsocket(socketClient)

    //     if (socketClient) {
    //         socketClient.on('connect', () => {
    //             console.log('Connected to the Socket.IO server');
    //         })
    //     } else {
    //         console.log("Can not connect")
    //     }

    //     const interval = setInterval(() => {
    //         getDriverLiveLocation()
    //         console.log('Function called every 5 seconds');

    //         // setCounter(prevCounter => prevCounter + 1);'
    //     }, 10000);

    //     return () => {
    //         if (socket) {
    //             socket.disconnect();
    //             console.log('Disconnected from the Socket.IO server');
    //         }
    //         clearInterval(interval);

    //     };
    // }, [])

    const socketConnection = () => {
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

        // const interval = setInterval(() => {
        //     getDriverLiveLocation()
        //     console.log('Function called every 5 seconds');

        //     // setCounter(prevCounter => prevCounter + 1);'
        // }, 10000);
    }

    if (socket && rideInfo) {
        let otp = false
        socket.on("startRideNotifyUser", (data) => {
            console.log("startRideNotifyUser", data)
            otp = true
            setEndLat(parseFloat(rideInfo.dropoffCoordinates.latitude))
            setEndLong(parseFloat(rideInfo.dropoffCoordinates.longitude))
        })

        socket.on("endRideNotifyUser", (data) => {
            console.log("endRideNotifyUser", data)
            if (data.userId == rideInfo.user_id) {
                const queryParams = rideId ? { rideId } : {};
                console.log("query params", queryParams)
                const queryStringData = queryString.stringify(queryParams);
                navigate(`${userEndPoints.payment}?${queryStringData}`);
            }
        })


        socket.on("driverLoacationUpdateToUser", (data) => {
            console.log("driverLoacationUpdateToUser data", data)
            if (data.driverId == rideInfo.driver_id && !otp) {
                setEndLat(parseFloat(data.latitude))
                setEndLong(parseFloat(data.longitude))
            }
        })
    }

    // const getDriverLiveLocation = () => {
    //     if (socket && rideInfo) {
    //         const value = { driverId: rideInfo.driver_id }
    //         socket.emit("getDriverLocation", (value))
    //     } else {
    //         console.log(242)
    //     }
    // }


    const fetchDriverData = async (driverId: string) => {
        try {
            console.log("driverId", driverId)
            const response = await userAxios.get(`${userApis.getDriverData}?driverId=${driverId}`)
            setDriverInfo(response.data.driverData)
            setFeedback(response.data.feedBacks)
            console.log("fetch driver data :", response)
        } catch (error) {
            console.log("error in fetchDriverData", error)
            handleErrors(error)
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

    return (
        <div className="flex my-10 justify-center space-x-4">

            <div className="w-10/12 space-y-4">
                <div className='rounded-3xl shadow-2xl'>
                    <div className="flex">
                        <div className="w-8/12 m-10">
                            <div ref={mapContainer} style={{ width: '100%', height: '80vh' }} />
                        </div>
                        <div className="w-4/12 m-10 max-w-sm bg-white border border-gray-200 rounded-lg shadow">
                            <div className='flex justify-center'>
                                <img className="rounded-t-lg mt-6" src={driverInfo?.driverImageUrl} alt="no" />
                            </div>
                            <div className="p-5">
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Name : {driverInfo?.name}</p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Total Rides : {driverInfo?.RideDetails?.completedRides}</p>

                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Vehicle : {driverInfo?.vehicleDocuments.vehicleModel}</p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Registration no : {driverInfo?.vehicleDocuments.registration.registrationId}</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-5 scrollbar-hide" style={{ maxWidth: '100%' }}>
                        <div className="flex space-x-4">
                            {/* Review divs */}
                            {feedback?.map((item, index) => (
                                <div key={index} className="my-10 border rounded-3xl shadow-2xl p-4" style={{ flex: '0 0 auto', width: '20rem' }}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{renderStars(item.rating)}</h5>
                                    <p className="font-normal text-gray-700">{item.feedback}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

        </div>


    );
}

export default CurrentRideInfo