import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';
import { calculateDistance, fetchLocationName, fetchLocationSuggestions, getCoordinates } from './Home';
import userApis from '../../Constraints/apis/userApis';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import io from 'socket.io-client';


export interface LocationSuggestion {
    text: string;
    place_name: string;
}

interface Location {
    latitude: number | null;
    longitude: number | null;
}

function UserHome() {

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

    const mapContainer = useRef<HTMLDivElement | null>(null);

    const [markerRef, setmarkerRef] = useState<mapboxgl.Marker | null>(null);
    const [FromMarker, setFromMarker] = useState<mapboxgl.Marker | null>(null);
    const [ToMarker, setToMarker] = useState<mapboxgl.Marker | null>(null);

    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [fromLocation, setFromLocation] = useState<string>('');

    const [toLocation, setToLocation] = useState<string>('');

    const [fromCoordinate, setFromCoordinate] = useState<Location | null>(null);
    const [toCoordinate, setToCoordinate] = useState<Location | null>(null);

    const [fromLocationSuggestions, setFromLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [toLocationSuggestions, setToLocationSuggestions] = useState<LocationSuggestion[]>([]);

    const [standardPrice, SetStandardPrice] = useState<string>("");
    const [suvdPrice, SetSuvdPrice] = useState<string>("");
    const [premiumPrice, SetPremiumPrice] = useState<string>("");

    const [distance, SetDistance] = useState<string>("");
    const [showCabs, SetShowCabs] = useState(false);
    const [selectedCab, SetSelectedCab] = useState("");

    const [location, setLocation] = useState<Location>({
        latitude: 0,
        longitude: 0,
    });
    const [map, setMap] = useState<mapboxgl.Map | undefined>(undefined);


    // const [socket, setsocket] = useState<Socket | null>(null)

    useEffect(() => {

        const socketClient = io('http://localhost:8001/');

        if (socketClient) {
            console.log(socketClient)
            console.log(68)

            socketClient.on('connect', () => {
                console.log('Connected to the Socket.IO server');

                socketClient.emit("test", function () {
                    console.log('@hey-test working')
                })
                console.log("Clickeddd");
            })
        } else {
            console.log("Can not connect")
        }

    }, [])





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
                    setLatitude(12.971599);
                    setLongitude(77.594566);
                }
            );
        } else {
            toast.error("Geolocation is not supported in this browser.");
            setLatitude(12.971599);
            setLongitude(77.594566);
        }

        if (mapContainer.current && longitude && latitude) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 10,
            });

            map.on('style.load', () => {
                map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: [],
                        },
                    },
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'visibility': 'visible',
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': '#888',
                        'line-width': 8,
                    },
                });
            });

            const currentMarker = new mapboxgl.Marker({ draggable: true })
                .setLngLat([longitude, latitude])
                .addTo(map);


            setmarkerRef(currentMarker)
            setMap(map);
        }

        return () => {
            if (map) {
                map.remove();
            }

        };
    }, [latitude, longitude]);


    const handleBookRide = async () => {
        try {
            console.log("cab", selectedCab);
            if (!selectedCab) {
                toast.error("Please select the cab")
            }
            else {
                if (location) {
                    let amount

                    if (selectedCab == "Standard") {
                        amount = standardPrice
                    } else if (selectedCab == "SUV") {
                        amount = suvdPrice
                    } else if (selectedCab == "Premium") {
                        amount = premiumPrice
                    }

                    const data = {
                        latlong: location,
                        vehicle: selectedCab,
                        amount: amount
                    }

                    const response = await userAxios.post(userApis.bookRide, data)
                    console.log(response)
                }
            }

        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    const drawRoute = (map: mapboxgl.Map, fromCoordinates: mapboxgl.LngLatLike, toCoordinates: mapboxgl.LngLatLike, routeCoordinates: number[][]) => {
        try {
            const routeSource = map.getSource('route') as mapboxgl.GeoJSONSource;
            if (routeSource) {
                routeSource.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates,
                    },
                });

                const bounds = new mapboxgl.LngLatBounds(fromCoordinates, toCoordinates);
                map.fitBounds(bounds, { padding: 50 });
            } else {
                toast.error('Route source not found');
            }
        } catch (error) {
            console.error('drawRoute', error);
            toast.error((error as Error).message);
        }
    };

    const displayRoute = async (from: Location, to: Location) => {
        try {
            const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
            const response = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}`,
                {
                    params: {
                        access_token: accessToken,
                    },
                }
            );

            const directionsData = response.data;
            const routeCoordinates = polyline.decode(directionsData.routes[0].geometry);

            if (map) {
                // Create a GeoJSON source for the route
                const routeSource = map.getSource('route') as GeoJSONSource | undefined;
                if (routeSource) {
                    routeSource.setData({
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: routeCoordinates,
                        },
                    })

                    // Fit the map to the route
                    const bounds = routeCoordinates.reduce((bounds, coord) => {
                        return bounds.extend(coord);
                    }, new mapboxgl.LngLatBounds(routeCoordinates[0], routeCoordinates[0]));
                    map.fitBounds(bounds, { padding: 50 });
                }
            } else {
                console.log("no map")
            }

        } catch (error) {
            console.error('Error displaying route:', error);
            toast.error('Error displaying route');
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
                if (fromCoordinate && toCoordinate) {
                    const displayRout = await displayRoute(fromCoordinate, toCoordinate);
                    console.log("displayRout", displayRout)
                }
                // Access latitude and longitude properties correctly
                const fromLatitude = fromCoordinates.latitude;
                const fromLongitude = fromCoordinates.longitude;
                const toLatitude = toCoordinates.latitude;
                const toLongitude = toCoordinates.longitude;


                if (ToMarker) {
                    ToMarker.remove();
                }
                if (FromMarker) {
                    FromMarker.remove();
                }
                if (markerRef) {
                    markerRef.remove();
                }


                setFromCoordinate(fromCoordinates);
                setToCoordinate(toCoordinates);

                const distance = calculateDistance(
                    fromLatitude,
                    fromLongitude,
                    toLatitude,
                    toLongitude
                );

                const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

                const directionsResponse = await axios.get(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${fromLongitude},${fromLatitude};${toLongitude},${toLatitude}`,
                    {
                        params: {
                            access_token: accessToken,
                        },
                    }
                );

                const directionsData = directionsResponse.data;

                const routeCoordinates = directionsData.routes[0].geometry;
                const decodedCoordinates = polyline.decode(routeCoordinates);

                if (map && decodedCoordinates) {
                    // Use correct data types for fromCoordinates and toCoordinates
                    const fromCoordinates: mapboxgl.LngLatLike = [fromLongitude, fromLatitude];
                    const toCoordinates: mapboxgl.LngLatLike = [toLongitude, toLatitude];

                    const fromMarker = new mapboxgl.Marker()
                        .setLngLat([fromLongitude, fromLatitude])
                        .addTo(map);

                    const toMarker = new mapboxgl.Marker()
                        .setLngLat([toLongitude, toLatitude])
                        .addTo(map);

                    setFromMarker(fromMarker);
                    setToMarker(toMarker);

                    drawRoute(map, fromCoordinates, toCoordinates, decodedCoordinates);

                    SetShowCabs(true);
                    setLocation({ latitude, longitude });
                } else {
                    toast.error('Map not available or route not found');
                }

                if (distance) {
                    const distanceRounded = distance.toFixed(0);
                    SetDistance(distanceRounded);
                    SetStandardPrice((distance * 50).toFixed(0));
                    SetSuvdPrice((distance * 80).toFixed(0));
                    SetPremiumPrice((distance * 100).toFixed(0));
                }
            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.error('handleListCabs', error);
            toast.error((error as Error).message);
        }
    };





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



    return (
        <>
            <div className="flex h-96 justify-center">
                <div className="w-full h-96 overflow-hidden sm:flex">
                    <div className="w-full h-screen">
                        <img
                            className='w-full h-full object-cover'
                            src='https://images.pexels.com/photos/4429463/pexels-photo-4429463.jpeg?auto=compress&cs=tinysrgb&w=600'
                            alt=""
                        />
                    </div>
                </div>
            </div>


            <h1 className="text-3xl font-bold text-blue-800 justify-center flex mt-10 mb-3">Book a safe ride!</h1>
            <div className="flex justify-center">
                <div className="flex w-10/12 h-screen mb-44  justify-center items-center rounded-3xl overflow-hidden shadow-2xl">
                    <div className="w-full flex space-x-32">

                        <form className="ms-20" onSubmit={handleListCabs}>
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
                                    <div className="flex ms-6 w-full flex-col overflow-y-scroll max-h-32 mt-5 scrollbar-hide">
                                        <div className="max-h-28 p-4 mx-4 border rounded-lg mb-4">
                                            <div className="flex">
                                                <input type="radio" name="Standard" value="Standard" id="cab1" onClick={() => SetSelectedCab("Standard")} />
                                                <p className="felx ms-3">Standard</p>
                                                <p className='flex ms-6'>₹ {standardPrice}</p>
                                            </div>
                                            <label htmlFor="cab1" className="cursor-pointer flex">
                                                <img src="https://www.svgrepo.com/show/408292/car-white.svg" alt="Cab 1" className="w-32 h-24" />
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    height="1.5em"
                                                    viewBox="0 0 320 512"
                                                    className='mt-9'
                                                >
                                                    <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" />
                                                </svg>
                                                <p className='mt-10 ms-2'>4</p>
                                            </label>
                                        </div>

                                        <div className="max-h-28 p-4 mx-4 border rounded-lg mb-4">
                                            <div className="flex">
                                                <input type="radio" name="SUV" value="SUV" id="cab2" onClick={() => SetSelectedCab("SUV")} />
                                                <p className="text-center ms-3">SUV</p>
                                                <p className='flex ms-14'>₹ {suvdPrice}</p>
                                            </div>
                                            <label htmlFor="cab2 " className="cursor-pointer flex">
                                                <img src="https://www.svgrepo.com/show/408290/car-white.svg" alt="Cab 2" className="w-32 h-20" />
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    height="1.5em"
                                                    viewBox="0 0 320 512"
                                                    className='mt-9'
                                                >
                                                    <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" />
                                                </svg>
                                                <p className='mt-10 ms-2'>7</p>
                                            </label>
                                        </div>

                                        <div className="max-h-28 p-4 mx-4 border rounded-lg mb-4">
                                            <div className="flex">
                                                <input type="radio" name="Premium" value="Premium" id="cab3" onClick={() => SetSelectedCab("Premium")} />
                                                <p className="text-center ms-3">Premium</p>
                                                <p className='flex ms-6'>₹ {premiumPrice}</p>
                                            </div>
                                            <label htmlFor="cab3" className="cursor-pointer flex">
                                                <img src="https://www.svgrepo.com/show/408291/car-white.svg" alt="Cab 3" className="w-32 h-24" />
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                    height="1.5em"
                                                    viewBox="0 0 320 512"
                                                    className='mt-9'
                                                >
                                                    <path d="M112 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm40 304V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V256.9L59.4 304.5c-9.1 15.1-28.8 20-43.9 10.9s-20-28.8-10.9-43.9l58.3-97c17.4-28.9 48.6-46.6 82.3-46.6h29.7c33.7 0 64.9 17.7 82.3 46.6l58.3 97c9.1 15.1 4.2 34.8-10.9 43.9s-34.8 4.2-43.9-10.9L232 256.9V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V352H152z" />
                                                </svg>
                                                <p className='mt-10 ms-2'>4</p>
                                            </label>
                                        </div>
                                    </div>

                                    <button type="button" onClick={handleBookRide} className="w-full ms-10 text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-gray-600 dark:text-black dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">Confirm the Ride</button>

                                </>

                            }
                        </form>


                        <div className="w-7/12 h-96 flex mt-10 justify-center items-center">
                            <div className='rounded-3xl'
                                ref={mapContainer} style={{ width: '100%', height: '80vh' }} />;
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default UserHome
