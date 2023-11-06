import { useEffect, useState } from "react";
import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });

import io, { Socket } from 'socket.io-client';
import { useSelector, useDispatch } from "react-redux";
import { rootState } from "../../../utils/interfaces";
import { setDriverAvailable } from "../../../services/redux/slices/driverAuth";
import queryString from "query-string";
import driverEndPoints from "../../../Constraints/endPoints/driverEndPoints";
import { Link, useNavigate } from "react-router-dom";


export interface rideDetails {
    driverId: string
    userId: string
    userLat: string
    userLon: string
}

interface RideConfirmProps {
    amount: string
    userFromLocation: string
    userToLocation: string
    rideDistance: string
    distance: string

}

function Notification() {

    const driverId = useSelector((state: rootState) => state.driver.driverId);
    const vehicleType = useSelector((state: rootState) => state.driver.vehicleType);

    const [socket, setsocket] = useState<Socket | null>(null)

    const [rideDetails, SetRideDetails] = useState<RideConfirmProps | null>(null)
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [countdown, setCountdown] = useState<number>(15)


    const dispatch = useDispatch()
    const navigate = useNavigate()

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

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    setLatitude(position.coords.latitude);
                    setLongitude(position.coords.longitude);
                },
            );
        }

        return () => {
            socket?.disconnect()
            setsocket(null)
        }
    }, [])

    if (socket && latitude && longitude) {
        const value = { latitude, longitude, driverId, vehicleType }

        socket.on('driverlocationUpdate', (data) => {

            console.log('Received from server:', data);
            socket.emit("getdriverlocationUpdate", value)
        });

        socket.on("getDriverLocation", (data) => {
            console.log("getDriverLocation data", data)
            if (data.driverId == driverId) {
                const data = { latitude, longitude, driverId }
                socket.emit("locationUpdateFromDriver", data)
            }
        })

        socket.on("getDriverConfirmation", (data) => {
            console.log("getDriverConfirmation data", data)
            if (driverId == data.driverId) {
                SetRideDetails(data)
            }
        })
    }

    const rejectRide = () => {
        if (socket) {
            SetRideDetails(null)
            socket.emit("rejectedRide")
        }
    }

    const approveRide = () => {
        if (socket) {
            const driverid = { driverId }
            socket.emit("approveRide", driverid)
        }
    }

    if (socket) {
        socket.on("sendRideDetails", (data) => {
            console.log("ride confirm data", data)
            if (driverId == data.driverId) {
                console.log("driver ride confirm", data)
                const queryStringData = queryString.stringify(data);
                navigate(`${driverEndPoints.rideconfirm}?${queryStringData}`);
                dispatch(setDriverAvailable(false))
            }
        })
    }

    useEffect(() => {
        let countdownInterval: NodeJS.Timeout;

        if (rideDetails) {
            countdownInterval = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);

            setTimeout(() => {
                SetRideDetails(null);
            }, 15000);

            return () => {
                clearInterval(countdownInterval);
            };
        }

        setCountdown(15);

    }, [rideDetails]);

    return (
        <>
            <div className="flex h-screen justify-center mt-9" >
                <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <div className="border-b border-gray-200">
                                <ul className="flex" role="tablist">
                                    <li className="mr-1">
                                        <Link
                                            to={""}
                                            className="bg-gray-300  text-gray-700  py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
                                            role="tab"
                                            aria-selected="true"
                                        >
                                            Rides
                                        </Link>
                                    </li>

                                    <li className="mr-1">
                                        <Link
                                            to={driverEndPoints.scheduleRideNotification}
                                            className="border-gray-400 border-2  text-gray-700 hover:bg-white py-2 px-4 rounded-t-lg active:bg-white focus:outline-none focus:ring focus:ring-indigo-300"
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
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                From
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                To
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Ride Distance
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                User Distance
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                count down
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {rideDetails &&
                                            <tr className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {rideDetails.amount}
                                                </th>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.userFromLocation}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.userToLocation}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {rideDetails.rideDistance}
                                                </td>

                                                <td className="px-6 py-4 dark:text-white" >
                                                    {rideDetails.distance}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {countdown > 0 ? countdown + "s" : "Time's up!"}
                                                </td>

                                                <td className="px-6 py-4  dark:text-white">
                                                    <button className="me-5"
                                                        type="button"
                                                        onClick={approveRide}
                                                    >Approve</button>
                                                    <button
                                                        type="button"
                                                        onClick={rejectRide}
                                                    >Reject</button>
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
    );
}

export default Notification