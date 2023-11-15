import axios from "axios";
import mapboxgl from "mapbox-gl";
import { LocationSuggestion } from "../../../interfaces/user";

function degreesToRadians(degrees: number) {
    return degrees * (Math.PI / 180);
}

export function calculateDistance(lat1: number | null, lon1: number | null, lat2: number | null, lon2: number | null) {

    if (lat1 && lon1 && lat2 && lon2) {
        const earthRadius = 6371;
        const dLat = degreesToRadians(lat2 - lat1);
        const dLon = degreesToRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;

        return distance;
    }
}

export const getCoordinates = async (location: string) => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    try {
        console.log("location", location)
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${location}.json`, {
            params: {
                access_token: mapboxgl.accessToken,
            },
        });

        const features = response.data.features;
        console.log("features", features)
        if (features.length > 0) {
            const [longitude, latitude] = features[0].center;
            return { latitude, longitude };
        }

        return null;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
};

export const fetchLocationSuggestions = async (query: string) => {
    try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`, {
            params: {
                access_token: mapboxgl.accessToken,
            },
        });


        const suggestions = response.data.features.map((feature: LocationSuggestion) => ({
            text: feature.place_name,
        }));

        console.log('Location suggestions:', suggestions);
        return suggestions

    } catch (error) {
        throw new Error('Failed to fetch location suggestions');
    }
};

export const fetchLocationName = async (latitude: number | null, longitude: number | null) => {
    const mapboxApiKey = import.meta.env.VITE_MAPBOX_TOKEN;

    try {
        const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`;
        const params = {
            types: 'place',
            access_token: mapboxApiKey,
        };

        const response = await axios.get(apiUrl, { params });
        const placeName = response.data.features[0].place_name;

        return placeName;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(`fetchLocationError ${error}`);
    }
};

// CALCULATE THE DURATION
export function calculateTravelTime(distance: number | undefined, speed: number) {
    // Ensure both distance and speed are positive numbers
    if (distance) {
        if (distance <= 0 || speed <= 0) {
            return "Distance and speed must be positive numbers.";
        }

        // Calculate the time in hours
        const timeInHours = distance / speed;

        return timeInHours;
    }

}

// CHECK THE DATEA AND TIME IS ONE HOURES GREATER THAN THE CURRENT DATE AND TIME
export function isOneHourGreater(dateTime: string | number | Date) {
    const currentDateTime = new Date();
    const oneHourLater = new Date(currentDateTime);
    oneHourLater.setHours(currentDateTime.getHours() + 1);

    // Convert the input dateTime to a Date object if it's not already
    if (!(dateTime instanceof Date)) {
        dateTime = new Date(dateTime);
    }

    return dateTime > oneHourLater;
}

// HANDLE PRICE
export const handlePrice = (price: string, distance: string) => {
    const priceInt = parseInt(price)
    const distanceInt = parseInt(distance)
    return (priceInt * distanceInt).toFixed(0)
} 