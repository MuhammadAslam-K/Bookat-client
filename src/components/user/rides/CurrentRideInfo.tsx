import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
                console.log("rideId", rideId)
                const response = await userAxios.post(userApis.getRideDetails, { rideId })
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
                // fetchComments(response.data.driver_id)
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

    // const fetchComments = async (driverId: string) => {
    //     try {
    //         const response = await userAxios.post(userApis.getFeedbacks, { driverId })
    //         // setDriverInfo(response.data)
    //         setFeedback(response.data)
    //         console.log("Comment data :", response)
    //     } catch (error) {
    //         console.log("error in fetchComments", error)
    //         if (axios.isAxiosError(error)) {
    //             const axiosError: AxiosError<ErrorResponse> = error;
    //             if (axiosError.response?.data) {
    //                 toast.error(axiosError.response.data.error);
    //             } else {
    //                 toast.error('Network Error occurred.');
    //             }
    //         }
    //     }
    // }

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
                                {/* <img className="rounded-t-lg mt-6" src="data:image/jpeg;base64,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" alt="no" /> */}
                                <img className="rounded-t-lg mt-6" src={driverInfo?.driverImageUrl} alt="no" />
                            </div>
                            <div className="p-5">
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Name : {driverInfo?.name}</p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Total Rides : {driverInfo?.RideDetails?.completedRides}</p>

                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Vehicle : {driverInfo?.vehicleDocuments.vehicleModel}</p>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Registration no : {driverInfo?.vehicleDocuments.registration.registrationId}</p>

                                {/* <div className="flex">
                                    <p>chat</p>
                                    <svg
                                        className='ms-2 mt-1 w-7 h-4'
                                        xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 448c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9c-5.5 9.2-11.1 16.6-15.2 21.6c-2.1 2.5-3.7 4.4-4.9 5.7c-.6 .6-1 1.1-1.3 1.4l-.3 .3 0 0 0 0 0 0 0 0c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c28.7 0 57.6-8.9 81.6-19.3c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9zM128 208a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 0a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm96 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" /></svg>
                                </div> */}
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto p-5 scrollbar-hide" style={{ maxWidth: '100%' }}>
                        <div className="flex space-x-4">
                            {/* Review divs */}
                            {feedback?.map((item) => (
                                <div className="my-10 border rounded-3xl shadow-2xl p-4" style={{ flex: '0 0 auto', width: '20rem' }}>
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