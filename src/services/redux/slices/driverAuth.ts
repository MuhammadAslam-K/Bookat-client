import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false
}

export const driverAuthSlice = createSlice({
    name: "driverAuth",
    initialState,
    reducers: {
        driverLogin: (state) => {
            state.loggedIn = true;
        },
        driverLogout: (state) => {
            state.loggedIn = false;
        }
    }
})

export const { driverLogin, driverLogout } = driverAuthSlice.actions;

export default driverAuthSlice.reducer;
