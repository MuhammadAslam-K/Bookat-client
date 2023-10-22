import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    document: false,
    vehicle: false,
    driverId: null,
    vehicleType: null,
    available: true,
}

export const driverAuthSlice = createSlice({
    name: "driverAuth",
    initialState,
    reducers: {
        driverLogin: (state, action) => {
            state.loggedIn = true;
            state.document = action.payload.document;
            state.vehicle = action.payload.vehicle;
            state.driverId = action.payload.driverId;
            state.vehicleType = action.payload.vehicleType
        },
        setDocument: (state) => {
            state.document = true;
        },
        setVehicle: (state) => {
            state.vehicle = true;
        },
        setDriverAvailable: (state, action) => {
            state.available = action.payload.available
        },

        driverLogout: (state) => {
            state.loggedIn = false;
            state.driverId = null
            state.vehicleType = null
        }
    }
})

export const { driverLogin, driverLogout, setDocument, setVehicle, setDriverAvailable } = driverAuthSlice.actions;

export default driverAuthSlice.reducer;
