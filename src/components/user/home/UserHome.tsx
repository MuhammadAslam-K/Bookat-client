import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import { calculateDistance, calculateTravelTime, fetchLocationName, fetchLocationSuggestions, getCoordinates, handlePrice, isOneHourGreater } from './Home';
import io, { Socket } from 'socket.io-client';
import { useSelector, useDispatch } from 'react-redux';
import { rootState } from '../../../utils/interfaces';
import { useNavigate } from "react-router-dom"
import userEndPoints from '../../../Constraints/endPoints/userEndPoints';
import { userLogout } from '../../../services/redux/slices/userAuth';
import queryString from 'query-string';
import 'react-datepicker/dist/react-datepicker.css';
import DateTimePickerModal from '../DateTimeModal'; // Make sure to import the DateTimePickerModal component
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../profile/UserProfile';
import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../../Constraints/apis/userApis';
import { handleErrors } from '../../../Constraints/apiErrorHandling';


export interface LocationSuggestion {
    text: string;
    place_name: string;
}

interface carData {
    cabType: string,
    maxPersons: string,
    price: string,
    image: string,
    drivers: []
}

function UserHome() {

    const userId = useSelector((state: rootState) => state.user.userId);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const [markerRef, setmarkerRef] = useState<mapboxgl.Marker | null>(null);
    const mapContainer = useRef<HTMLDivElement | null>(null);

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [fromLocation, setFromLocation] = useState<string>('');
    const [toLocation, setToLocation] = useState<string>('');

    const [fromLocationLat, setFromLocationLat] = useState<number>(0);
    const [fromLocationLong, setFromLocationLong] = useState<number>(0);

    const [toLocationLat, setToLocationLat] = useState<number>(0);
    const [toLocationLong, setToLocationLong] = useState<number>(0);


    const [fromLocationSuggestions, setFromLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [toLocationSuggestions, setToLocationSuggestions] = useState<LocationSuggestion[]>([]);

    const [amount, SetAmount] = useState<string>('')
    const [carData, SetCarData] = useState<carData[]>()
    // const [standardPrice, SetStandardPrice] = useState<string>("");
    // const [suvdPrice, SetSuvdPrice] = useState<string>("");
    // const [premiumPrice, SetPremiumPrice] = useState<string>("");


    const [distance, SetDistance] = useState<string>("");
    const [duration, SetDuration] = useState<number>(0);

    const [showCabs, SetShowCabs] = useState(false);
    const [selectedCab, SetSelectedCab] = useState("");


    const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);


    const [socket, setsocket] = useState<Socket | null>(null)
    const [modal, setmodal] = useState(false)

    const [sheduledRideModal, SetSheduleRideModal] = useState(false);
    const [selectedDateTime, setSelectedDateTime] = useState(null);

    const handleDateSelect = (date) => {
        console.log("date", date)
        setSelectedDateTime(date);
    };

    // MAP BOX
    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
                function (error) {
                    toast.error("Error getting location");
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            toast.error("Geolocation is not supported in this browser.");
        }


        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        if (mapContainer.current && longitude && latitude) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 10,
            });
            setMap(map);

            map.on('load', () => {
                // Set the map style after the map has loaded
                map.setStyle('mapbox://styles/mapbox/streets-v11');

                const currentMarker = new mapboxgl.Marker({ draggable: true })
                    .setLngLat([longitude, latitude])
                    .addTo(map);

                setmarkerRef(currentMarker);
            });
        }


        return () => {
            if (map) {
                map.remove();
            }

        };
    }, [latitude, longitude]);



    const drawRoute = (fromLatitude: unknown,
        fromLongitude: unknown,
        toLatitude: unknown,
        toLongitude: unknown) => {


        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving-traffic',
            controls: {
                inputs: false,
                instructions: false,
            },
        });

        if (map) {
            map.addControl(directions, 'top-left');

            const startingPoint = [fromLongitude, fromLatitude];
            const endPoint = [toLongitude, toLatitude];

            // Set the route
            directions.setOrigin(startingPoint);
            directions.setDestination(endPoint);
        }
    }

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
                socket.disconnect()
            }
        }

    }, [])

    const handleCancleRide = () => {
        socket?.emit("userCancelRide")
        setmodal(false)
    }

    socket?.on("sendRideDetails", (data) => {
        if (data.userId == userId) {
            console.log("driver ride confirm", data)
            const queryStringData = queryString.stringify(data);
            navigate(`${userEndPoints.rideconfirm}?${queryStringData}`);
        }
    })

    // CAR DATA
    useEffect(() => {
        const fetchCabData = async () => {
            try {
                const response = await userAxios.get(userApis.getCabData)
                console.log(response.data)
                SetCarData(response.data)
            } catch (error) {
                handleErrors(error)
            }
        }
        fetchCabData()
    }, [])


    const handleQuickRide = async () => {
        try {
            if (!selectedCab) {
                toast.error("Please select the cab")
            }
            else {
                if (location) {

                    const data = {
                        latitude,
                        longitude,
                        vehicle: selectedCab,
                        amount,
                        userId,
                        fromLocation,
                        toLocation,
                        distance,
                        duration,
                        fromLocationLat,
                        fromLocationLong,
                        toLocationLat,
                        toLocationLong,
                    }
                    if (userId) {
                        setmodal(true)
                        socket?.emit("confirmRide", data)
                    } else {
                        toast.error("please login")
                        dispatch(userLogout())
                        navigate(userEndPoints.login)
                    }
                }
            }

        } catch (error) {
            toast.error((error as Error).message)
        }
    }


    const handleListCabs = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (fromLocation === toLocation) {
                toast.error('Choose a valid location');
                return;
            }

            const fromCoordinates = await getCoordinates(fromLocation);
            const toCoordinates = await getCoordinates(toLocation);

            if (fromCoordinates && toCoordinates) {

                const fromLatitude = fromCoordinates.latitude;
                const fromLongitude = fromCoordinates.longitude;
                const toLatitude = toCoordinates.latitude;
                const toLongitude = toCoordinates.longitude;

                setFromLocationLat(fromLatitude)
                setFromLocationLong(fromLongitude)
                setToLocationLat(toLatitude)
                setToLocationLong(toLongitude)


                if (markerRef) {
                    markerRef.remove();
                }

                SetShowCabs(true)
                const distance = calculateDistance(
                    fromLatitude,
                    fromLongitude,
                    toLatitude,
                    toLongitude
                );

                const duration = calculateTravelTime(distance, 40);
                if (typeof duration == 'number') {
                    SetDuration(duration);
                }

                drawRoute(
                    fromLatitude,
                    fromLongitude,
                    toLatitude,
                    toLongitude
                );

                if (distance) {
                    const distanceRounded = distance.toFixed(0);
                    SetDistance(distanceRounded);
                    // SetStandardPrice((distance * 50).toFixed(0));
                    // SetSuvdPrice((distance * 80).toFixed(0));
                    // SetPremiumPrice((distance * 100).toFixed(0));
                }
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('handleListCabs', error);
            toast.error((error as Error).message);
        }
    };

    const handleScheduleBooking = async () => {
        try {
            if (!selectedCab) {
                toast.error("Please select cab.")
            }

            if (selectedDateTime) {
                // const dateTime = new Date(selectedDateTime);
                // const currentTime = new Date();
                // const timeDifference = dateTime.getTime() - currentTime.getTime();
                // const oneHourInMillis = 60 * 60 * 1000;
                // console.log("timeDifference", timeDifference)
                // console.log("oneHourInMillis", oneHourInMillis)

                // if (timeDifference < oneHourInMillis) {
                //     toast.error("Ride must be booked at least 1 hour in advance.")
                //     return false
                // }

                const result = isOneHourGreater(selectedDateTime)
                console.log(result)
                if (!result) {
                    toast.error("Ride must be booked at least 1 hour in advance.")
                    return false
                }
            } else {
                toast.error("Something went wrong try again")
                return false
            }


            const data = {
                vehicle: selectedCab,
                amount,
                fromLocation,
                toLocation,
                distance,
                duration,
                fromLocationLat,
                fromLocationLong,
                toLocationLat,
                toLocationLong,
                selectedDateTime
            }
            await userAxios.post(userApis.scheduleTheRide, data)
            toast.success("Successfully booked the ride.");
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




    const handleFromLocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setFromLocation(value);

        setTimeout(async () => {
            const suggestions = await fetchLocationSuggestions(value);

            if (suggestions) {
                setFromLocationSuggestions(suggestions)
            }
        }, 2000);
    };

    const handleToLocationChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setToLocation(value);
        setTimeout(async () => {
            const suggestions = await fetchLocationSuggestions(value);
            console.log("sugg", suggestions)
            if (suggestions) {
                setToLocationSuggestions(suggestions);
            }
        }, 2000);

    };

    const handleSuggestionSelection = (
        suggestion: LocationSuggestion,
        setInputValue: React.Dispatch<React.SetStateAction<string>>,
        setSuggestions: React.Dispatch<React.SetStateAction<LocationSuggestion[]>>
    ) => {
        setInputValue(suggestion.text);
        setSuggestions([]);
    };

    const backgroundImageUrl = "../../../../public/images/pexels-ketut-subiyanto-4429505.jpg"
    const backgroundImageUrl1 = "../../../../public/images/pexels-jeshootscom-13861.jpg"
    const backgroundImageUrl2 = "../../../../public/images/pexels-yan-krukau-8867434.jpg"
    const backgroundImageUrl3 = "../../../../public/images/pexels-cottonbro-studio-4606338.jpg"

    const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '32rem',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage: `url(${backgroundImageUrl})`
    };


    return (
        <>

            <div className="w-full bg-cover bg-center" style={containerStyle}>
                <div className="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
                    <div className="text-center">
                        <h1 className="text-white text-2xl font-semibold uppercase md:text-3xl">Your Journey, Our Destination Where Every Mile Matters
                            <p className="underline text-white">Book@</p>
                        </h1>
                    </div>
                </div>
            </div>

            <h1 className="text-3xl font-bold text-blue-800 justify-center flex mt-10 mb-3">Book a safe ride!</h1>
            <div className="flex justify-center">
                <div className="flex w-10/12 h-fit justify-center items-center rounded-3xl overflow-hidden shadow-2xl">
                    {modal &&
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                            <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                                <h1 className='text-center font-semibold text-2xl'>Be relax !</h1>
                                <p>We're connecting with the best drivers in your area.</p>

                                <div className="flex justify-center my-2 items-center h-16">
                                    <div className="relative inline-flex">
                                        <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                                        <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                                        <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                                    </div>
                                </div>

                                <p className='max-w-sm'>Thank you for choosing Book@!. Your safety and satisfaction are our top priorities.</p>

                                <button type='button' onClick={handleCancleRide} className='p-2 px-3 border border-slate-600 rounded-lg ms-32 m-2'>Cancel Ride</button>

                            </div>
                        </div>
                    }
                    {sheduledRideModal &&
                        <DateTimePickerModal
                            isOpen={sheduledRideModal}
                            onClose={() => SetSheduleRideModal(false)}
                            onSelectDate={handleDateSelect}
                            handleScheduleBooking={handleScheduleBooking}
                        />
                    }

                    <div className="w-full flex m-10 space-x-32">

                        <form className="ms-20 m-10" onSubmit={handleListCabs} style={{ maxWidth: "270px" }}>
                            <div className="justify-start w-full ms-10 items-start flex flex-col">
                                <div className="w-full mb-6 md:mb-0 relative">

                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        From
                                    </label>
                                    <div className="w-full flex item-center">
                                        <input
                                            type="text"
                                            name="from"
                                            placeholder="Enter a location"
                                            value={fromLocation}
                                            onChange={handleFromLocationChange}
                                            className="pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20"
                                            viewBox="0 0 512 512"
                                            className="mt-3 ms-3 cursor-pointer"
                                            onClick={async () => setFromLocation(await fetchLocationName(latitude, longitude))}
                                        >
                                            <title>Choose the current location</title>
                                            <path
                                                d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
                                            />
                                        </svg>


                                    </div>
                                    <ul className="text-xs absolute left-0 right-0 z-10  rounded-xl bg-gray-100 shadow-2xl w-full overflow-hidden">
                                        {fromLocationSuggestions.map((suggestion, index) => (
                                            <li
                                                className={`p-1.5 sm:text-sm text-xs font-medium w-full cursor-pointer ${index < fromLocationSuggestions.length - 1
                                                    ? 'border-b border-slate-300'
                                                    : ''
                                                    }`}
                                                key={index}
                                                title={suggestion.text}
                                                onClick={() => handleSuggestionSelection(suggestion, setFromLocation, setFromLocationSuggestions)}
                                                style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {suggestion.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="w-full my-6 md:mb-0 relative">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        To
                                    </label>
                                    <div className="w-full flex item-center">
                                        <input
                                            type="text"
                                            name="to"
                                            placeholder="Enter a location"
                                            value={toLocation}
                                            onChange={handleToLocationChange}
                                            className="pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            height="20"
                                            viewBox="0 0 512 512"
                                            className="mt-3 ms-3 cursor-pointer"
                                            onClick={async () => setToLocation(await fetchLocationName(latitude, longitude))}
                                        >
                                            <title>Choose the current location</title>
                                            <path
                                                d="M256 0c17.7 0 32 14.3 32 32V66.7C368.4 80.1 431.9 143.6 445.3 224H480c17.7 0 32 14.3 32 32s-14.3 32-32 32H445.3C431.9 368.4 368.4 431.9 288 445.3V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V445.3C143.6 431.9 80.1 368.4 66.7 288H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H66.7C80.1 143.6 143.6 80.1 224 66.7V32c0-17.7 14.3-32 32-32zM128 256a128 128 0 1 0 256 0 128 128 0 1 0 -256 0zm128-80a80 80 0 1 1 0 160 80 80 0 1 1 0-160z"
                                            />
                                        </svg>


                                    </div>
                                    <ul className="text-xs absolute left-0 right-0 z-10  rounded-xl bg-gray-100 shadow-2xl w-full overflow-hidden">
                                        {toLocationSuggestions.map((suggestion, index) => (
                                            <li
                                                className={`p-1.5 sm:text-sm text-xs font-medium w-full cursor-pointer ${index < fromLocationSuggestions.length - 1
                                                    ? 'border-b border-slate-300'
                                                    : ''
                                                    }`}
                                                key={index}
                                                title={suggestion.text}
                                                onClick={() => handleSuggestionSelection(suggestion, setToLocation, setToLocationSuggestions)} style={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                    fontSize: '12px',
                                                }}
                                            >
                                                {suggestion.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                            </div>

                            <button type="submit" className="mt-4 w-full ms-10 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Search Cabs</button>

                            {showCabs &&
                                <>
                                    <div className="shadow-inner h-10 ms-10 mt-5 p-2 border border-slate-500 w-full rounded-2xl justify-center text-center my-5">Distance :{distance}km</div>

                                    <div className="flex ms-6 w-full max-w-xs overflow-x-scroll mt-5 scrollbar-hide" >
                                        {carData?.filter(item => item.drivers?.length != 0).map(item => (
                                            <div className="max-h-28 border ms-3 rounded-lg mb-4 bg-white" style={{ minWidth: "270px" }}>
                                                <div className="flex">
                                                    <div className="flex">
                                                        <input type="radio" name="Standard" className='-mt-16' value="Standard" id="cab1" onClick={() => {
                                                            SetSelectedCab(item.cabType)
                                                            const Price = handlePrice(item.price, distance)
                                                            SetAmount(Price)
                                                        }} />
                                                        <img src={item.image} alt="Cab 1" className="w-32 h-24" />
                                                    </div>
                                                    <div className="m-3 ms-5">
                                                        <p>{item.cabType}</p>
                                                        <p>₹ {handlePrice(item.price, distance)}</p>
                                                        <label htmlFor="cab1" className="cursor-pointer flex">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                height="1.5em"
                                                                viewBox="0 0 320 512"
                                                                className=''
                                                            >
                                                                <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" />
                                                            </svg>
                                                            <p className=' ms-2'>{item.maxPersons}</p>
                                                        </label>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}
                                    </div>

                                    <button type="button" onClick={() => SetSheduleRideModal(true)} className="ms-10 w-full text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Schedule a Ride</button>
                                    <button type="button" onClick={handleQuickRide} className="w-full ms-10 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-black dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Confirm the Ride</button>

                                </>

                            }
                        </form>

                        <div className="w-7/12 h-96 flex my-10 justify-center items-center">
                            <div className='rounded-3xl'
                                ref={mapContainer} style={{ width: '100%', height: '100vh' }} />;
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center flex justify-center  my-5 mt-16">
                <p className='font-bold flex text-blue-800 text-4xl'>Why Book@ ?</p>
            </div>

            <div className="flex flex-wrap justify-center w-10/12 mx-auto">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 relative">
                    <div className="bg-cover text-white text-center bg-center h-64 sm:h-72 md:h-80 lg:h-80 xl:h-80 rounded-lg" style={{ backgroundImage: `url(${backgroundImageUrl3})` }}>
                        <div className="absolute bottom-0 text-white p-4">
                            <h1 className="font-bold text-xl mb-5">Safty</h1>
                            <p>At Book@, we prioritize your safety above all else. Our cab booking service is designed to provide you with a secure and comfortable travel experience</p>

                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 relative">
                    <div className="bg-cover text-white text-center bg-center h-64 sm:h-72 md:h-80 lg:h-80 xl:h-80 rounded-lg" style={{ backgroundImage: `url(${backgroundImageUrl1})` }}>
                        <div className="absolute bottom-0 text-white p-4">
                            <h1 className="font-bold text-xl mb-5">Unmatched Convenience</h1>
                            <p>Experience the ultimate convenience with Book@. All our drivers undergo strict background checks. We offer a range of services tailored to meet the diverse needs of modern women on the move.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 p-4 relative">
                    <div className="bg-cover text-white text-center bg-center h-64 sm:h-72 md:h-80 lg:h-80 xl:h-80 rounded-lg" style={{ backgroundImage: `url(${backgroundImageUrl2})` }}>
                        <div className="absolute bottom-0 text-white p-4">
                            <h1 className="font-bold text-xl mb-5">Dedicated Assistance</h1>
                            <p>At Book@, we are committed to providing exceptional customer support. Our dedicated team is available round-the-clock to assist you with any queries or concerns you may have.</p>
                        </div>
                    </div>
                </div>
            </div>




        </>
    )
}

export default UserHome
