import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client';
import DataTable from "react-data-table-component"


import { handleErrors } from '../../../Constraints/apiErrorHandling'
import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../../Constraints/apis/userApis';
import toast from 'react-hot-toast';
import { calculateTravelTime, isOneHourGreater } from '../home/Home';
import queryString from 'query-string';
import userEndPoints from '../../../Constraints/endPoints/userEndPoints';
import { useNavigate } from 'react-router';
import { rootState } from '../../../utils/interfaces';
import { useSelector } from 'react-redux';
import DateTimePickerModal from '../DateTimeModal';


interface Ride {
    _id: string;
    status: string;
    date: string;
    distance: string;
    dropoffLocation: string;
    pickupLocation: string;
    price: number;
    vehicleType: string;
    favourite: boolean
}


type Column = {
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selector?: (row: Ride) => any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cell?: any;
    hide?: () => boolean;
};

type ColumnsMap = {
    [key: string]: Column[];
};

function UserRideHistory() {

    const userId = useSelector((state: rootState) => state.user.userId);
    const navigate = useNavigate()

    const [quickRidesInfo, SetQuickRidesInfo] = useState<Ride[]>([])
    const [scheduledRidesInfo, SetScheduledRidesInfo] = useState<Ride[] | null>(null)
    const [favouriteRidesInfo, setFavouriteRidesInfo] = useState<Ride[]>([]);

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [activeTab, setActiveTab] = useState("quickRides");
    const [socket, setsocket] = useState<Socket | null>(null)

    const [modal, setmodal] = useState(false)
    const [sheduledRideModal, SetSheduledRideModal] = useState(false)
    const [reload, SetReload] = useState(false)

    const [rideId, SetRideId] = useState<string>()
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);



    const handleDateSelect = (date: Date) => {
        console.log("date", date)
        setSelectedDateTime(date);
    };

    const current_tab = "cursor-pointer bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
    const pre_tab = "cursor-pointer border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"


    useEffect(() => {
        fetchUserData()
    }, [reload])

    // SOCKET
    useEffect(() => {

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLatitude(position.coords.latitude)
                    setLongitude(position.coords.longitude)
                },
                function (error) {
                    toast.error("Error getting location");
                    console.error('Error getting location:', error.message);
                }
            );
        } else {
            toast.error("Geolocation is not supported in this browser.");
        }

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const fetchUserData = async () => {
        try {
            const response = await userAxios.get(userApis.getRideHistory)
            console.log("response", response)
            SetQuickRidesInfo(response.data.quickRides)
            SetScheduledRidesInfo(response.data.scheduledRides)
            setFavouriteRidesInfo(response.data.favouriteRides);

        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    const handleFavouriteRide = async (id: string) => {
        try {
            const response = await userAxios.patch(`${userApis.addToFavourite}?id=${id}`)
            console.log("response", response)
            SetReload(!reload)
        } catch (error) {
            handleErrors(error)
        }
    }

    const handleGetQuickRideInfo = async (id: string) => {
        try {
            const response = await userAxios.get(`${userApis.quickRideInfo}?id=${id}`)
            const rideInfo = response.data
            console.log(rideInfo)
            handleBookQuickRide(rideInfo)
        } catch (error) {
            handleErrors(error)
        }
    }

    const handleScheduleBooking = async () => {
        try {
            if (selectedDateTime) {
                const result = isOneHourGreater(selectedDateTime)
                if (!result) {
                    toast.error("Ride must be booked at least 2 hour in advance.")
                    return false
                }
            } else {
                toast.error("Something went wrong try again")
                return false
            }
            const data = { selectedDateTime, rideId }
            const response = await userAxios.post(userApis.reScheduleTheRide, data)
            toast.success("Ride Booked Successfully")
            console.log(response)
        } catch (error) {
            handleErrors(error)
        }
    }


    const handleBookQuickRide = (rideInfo: {
        dropoffLocation: string; distance: string; vehicleType: string; price: string; user_id: string; pickupLocation: string; dropoffCoordinates: { latitude: string; longitude: string; }; pickupCoordinates: { latitude: string; longitude: string; };
    }) => {

        const distanceInt = parseInt(rideInfo.distance)
        const duration = calculateTravelTime(distanceInt, 40);
        console.log(duration)
        console.log("latitude,longitude", rideInfo.dropoffLocation)
        const data = {
            latitude,
            longitude,
            vehicle: rideInfo.vehicleType,
            amount: rideInfo.price,
            userId: rideInfo.user_id,
            fromLocation: rideInfo.pickupLocation,
            toLocation: rideInfo.dropoffLocation,
            distance: rideInfo.distance,
            duration: duration,
            fromLocationLat: rideInfo.pickupCoordinates.latitude,
            fromLocationLong: rideInfo.pickupCoordinates.longitude,
            toLocationLat: rideInfo.dropoffCoordinates.latitude,
            toLocationLong: rideInfo.dropoffCoordinates.longitude,
        }
        setmodal(true)
        socket?.emit("confirmRide", data)
    }

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


    const ActionCell = (row: Ride) => (
        <p title={row.favourite ? "Remove From Favourite" : "Add To Favourite"} className='cursor-pointer' onClick={() => handleFavouriteRide(row._id)}>
            {row.favourite ? (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path fill="#eeff00" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 576 512">
                    <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                </svg>
            )}
        </p>
    );

    const quickRidesColumns = [

        {
            name: 'From',
            selector: (row: Ride) => (
                <span title={row.pickupLocation} > {row.pickupLocation}</span>
            )
        },
        {
            name: 'To',
            selector: (row: Ride) => (
                <span title={row.dropoffLocation} > {row.dropoffLocation}</span>
            )
        },
        {
            name: 'Amount',
            selector: (row: Ride) => row.price,
        },
        {
            name: 'Distance',
            selector: (row: Ride) => row.distance,
        },
        {
            name: 'Vehicle Type',
            selector: (row: Ride) => row.vehicleType,
        },
        {
            name: 'Status',
            selector: (row: Ride) => row.status,
            hide: () => activeTab === "favouriteRides",
        },
        {
            name: 'Action',
            cell: ActionCell,
            hide: () => activeTab !== "favouriteRides",

        },

    ]

    const favouriteRidesColumns = [

        {
            name: 'From',
            selector: (row: Ride) => (
                <span title={row.pickupLocation} > {row.pickupLocation}</span>
            )
        },
        {
            name: 'To',
            selector: (row: Ride) => (
                <span title={row.dropoffLocation} > {row.dropoffLocation}</span>
            )
        },
        {
            name: 'Amount',
            selector: (row: Ride) => row.price,
        },
        {
            name: 'Distance',
            selector: (row: Ride) => row.distance,
        },
        {
            name: 'Vehicle Type',
            selector: (row: Ride) => row.vehicleType,
        },
        {
            name: 'Favourite',
            cell: ActionCell,
        },
        {
            name: 'Action',
            selector: (row: Ride) => (
                <div className="cursor-pointer">
                    <p
                        className="p-2 m-2 rounded-lg border-2 border-blue-500 hover:bg-blue-500 hover:text-white focus:outline-none"
                        onClick={() => handleGetQuickRideInfo(row._id)}
                    >
                        Quick Ride
                    </p>
                    <p
                        className="p-2 m-2 rounded-lg border-2 border-green-500 hover:bg-green-500 hover:text-white focus:outline-none"
                        onClick={() => { SetRideId(row._id), SetSheduledRideModal(true) }}
                    >
                        Schedule Ride
                    </p>
                </div>

            )
        }

    ]

    const columnsMap: ColumnsMap = {
        quickRides: quickRidesColumns,
        scheduledRides: quickRidesColumns,
        favouriteRides: favouriteRidesColumns,
    };
    const columns = columnsMap[activeTab] || [];


    return (

        <div className="mt-10 w-10/12 ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center">
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
                    onClose={() => SetSheduledRideModal(false)}
                    onSelectDate={handleDateSelect}
                    handleScheduleBooking={handleScheduleBooking}
                />
            }

            <div className="border-b border-gray-200">
                <ul className="flex" role="tablist">
                    <li className="mr-1">
                        <p
                            onClick={() => setActiveTab("quickRides")}
                            className={activeTab === "quickRides" ? current_tab : pre_tab}
                            role="tab"
                            aria-selected={activeTab === "quickRides"}
                        >
                            Quick Rides
                        </p>
                    </li>

                    <li className="mr-1">
                        <p
                            onClick={() => setActiveTab("scheduledRides")}
                            className={activeTab === "scheduledRides" ? current_tab : pre_tab}
                            role="tab"
                            aria-selected={activeTab === "scheduledRides"}
                        >
                            Scheduled Rides
                        </p>
                    </li>
                    <li className="mr-1">
                        <p
                            onClick={() => setActiveTab("favouriteRides")}
                            className={activeTab === "favouriteRides" ? current_tab : pre_tab}
                            role="tab"
                            aria-selected={activeTab === "favouriteRides"}
                        >
                            Favourite Rides
                        </p>
                    </li>

                </ul>
            </div>
            {quickRidesInfo && scheduledRidesInfo && favouriteRidesInfo && (
                <DataTable
                    style={{ zIndex: '-1' }}
                    columns={columns}
                    data={activeTab === "quickRides" ? quickRidesInfo : activeTab === "scheduledRides" ? scheduledRidesInfo : favouriteRidesInfo}
                    fixedHeader
                    highlightOnHover
                    pagination
                />
            )}

        </div>
    )
}

export default UserRideHistory