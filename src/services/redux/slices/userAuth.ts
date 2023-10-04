import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false
}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state) => {
            state.loggedIn = true;
        },
        userLogout: (state) => {
            state.loggedIn = false;
        }
    }
})

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;
