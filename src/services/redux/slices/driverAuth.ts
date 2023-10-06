import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    document: false,
    vehicle: false
}

export const driverAuthSlice = createSlice({
    name: "driverAuth",
    initialState,
    reducers: {
        driverLogin: (state, action) => {
            state.loggedIn = true;
            state.document = action.payload.document;
            state.vehicle = action.payload.vehicle;
        },
        setDocument: (state) => {
            state.document = true;
        },
        setVehicle: (state) => {
            state.vehicle = true;
        },

        driverLogout: (state) => {
            state.loggedIn = false;
        }
    }
})

export const { driverLogin, driverLogout, setDocument, setVehicle } = driverAuthSlice.actions;

export default driverAuthSlice.reducer;
