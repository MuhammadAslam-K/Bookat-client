import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    userId: null,
    mobile: null
}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.loggedIn = true;
            state.userId = action.payload.userId
            state.mobile = action.payload.mobile
        },

        userLogout: (state) => {
            state.loggedIn = false;
            state.userId = null;
            state.mobile = null
        },
    }
})

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;
