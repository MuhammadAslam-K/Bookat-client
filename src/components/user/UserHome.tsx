import mapboxgl from 'mapbox-gl';
import { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';
import { calculateDistance, fetchLocationName, fetchLocationSuggestions, getCoordinates } from './Home';
import userApis from '../../Constraints/apis/userApis';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import axios from 'axios';
import polyline from '@mapbox/polyline';


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

    const mapContainer = useRef<HTMLDivElement>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [fromLocation, setFromLocation] = useState<string>('');
    const [toLocation, setToLocation] = useState<string>('');

    const [fromLocationSuggestions, setFromLocationSuggestions] = useState<LocationSuggestion[]>([]);
    const [toLocationSuggestions, setToLocationSuggestions] = useState<LocationSuggestion[]>([]);

    const [standardPrice, SetStandardPrice] = useState("")
    const [suvdPrice, SetSuvdPrice] = useState("")
    const [premiumPrice, SetPremiumPrice] = useState("")

    const [distance, SetDistance] = useState("")

    const [showCabs, SetShowcabs] = useState(false)
    const [selectedCab, SetSelectedCab] = useState("")

    const [location, setLocation] = useState<Location>({
        latitude: 0,
        longitude: 0,
    });
    const [map, setMap] = useState<mapboxgl.Map>();


    useEffect(() => {
        // let map: mapboxgl.Map | null = null;

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

        if (mapContainer.current && latitude !== null && longitude !== null) {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 10,
            });
            setMap(map);
            // if (map) {
            markerRef.current = new mapboxgl.Marker({ draggable: true })
                .setLngLat([longitude, latitude])

                .addTo(map);

            markerRef.current.on('dragend', () => {
                const lngLat = markerRef.current!.getLngLat();
                console.log('Marker moved to:', lngLat);
            });
            // }
        }

        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [latitude, longitude]);


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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawRoute = (map: mapboxgl.Map, fromCoordinates: mapboxgl.LngLatLike, toCoordinates: mapboxgl.LngLatLike, routeCoordinates: any[]) => {
        // Check if the source 'route' exists
        try {
            if (map.getSource('route') instanceof mapboxgl.GeoJSONSource) {
                // Update the route source with the fetched coordinates
                (map.getSource('route') as mapboxgl.GeoJSONSource).setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: routeCoordinates,
                    },
                });
            }

            // Set the map's center and zoom to fit the entire route
            const bounds = new mapboxgl.LngLatBounds(fromCoordinates, toCoordinates);
            map.fitBounds(bounds, { padding: 50 })
        }
        catch (error) {
            console.log("drawRoute", error)
            toast.error((error as Error).message)
        }
    }



    const handleListCabs = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        try {
            if (fromLocation === toLocation) {
                toast.error('Choose a valid location');
                return;
            }

            const fromCoordinates = await getCoordinates(fromLocation);
            const toCoordinates = await getCoordinates(toLocation);

            if (fromCoordinates && toCoordinates) {
                const { latitude: fromLatitude, longitude: fromLongitude } = fromCoordinates;
                const { latitude: toLatitude, longitude: toLongitude } = toCoordinates;

                const distance = calculateDistance(fromLatitude, fromLongitude, toLatitude, toLongitude);

                console.log('From Location Latitude:', fromLatitude);
                console.log('From Location Longitude:', fromLongitude);
                console.log('To Location Latitude:', toLatitude);
                console.log('To Location Longitude:', toLongitude);
                console.log('Distance (in kilometers):', distance);
                // mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
                const accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
                console.log("acccess token", accessToken)
                const directionsResponse = await axios.get(
                    `https://api.mapbox.com/directions/v5/mapbox/driving/${fromCoordinates.longitude},${fromCoordinates.latitude};${toCoordinates.longitude},${toCoordinates.latitude}`,
                    {
                        params: {
                            access_token: accessToken,
                        },
                    }
                );
                const directionsData = await directionsResponse.data


                const routeCoordinates = directionsData.routes[0].geometry

                const decodedCoordinates = polyline.decode(routeCoordinates);
                console.log("decodedCoordinates", decodedCoordinates)
                // Call the function to draw the route on the map using the existing 'map' instance
                if (map && decodedCoordinates) {
                    console.log(238);

                    const fromCoordinates: mapboxgl.LngLatLike = [fromLongitude, fromLatitude];
                    const toCoordinates: mapboxgl.LngLatLike = [toLongitude, toLatitude];

                    drawRoute(map, fromCoordinates, toCoordinates, decodedCoordinates);
                    console.log(244);
                    SetShowcabs(true);
                    setLocation({ latitude, longitude });
                } else {
                    console.log(269)
                    toast.error('Map not available or route not found');
                }

                SetShowcabs(true);
                setLocation({ latitude, longitude });

                const diatanceRounded = distance.toFixed(0);
                SetDistance(diatanceRounded);
                SetStandardPrice((distance * 50).toFixed(0));
                SetSuvdPrice((distance * 80).toFixed(0));
                SetPremiumPrice((distance * 100).toFixed(0));


            } else {
                toast.error('Location not found');
            }
        } catch (error) {
            console.log("handle list cab", error)
            toast.error((error as Error).message);
        }
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
