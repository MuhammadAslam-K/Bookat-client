import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    userId: null,

}

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.loggedIn = true;
            state.userId = action.payload.userId
        },

        userLogout: (state) => {
            state.loggedIn = false;
            state.userId = null
        },
    }
})

export const { userLogin, userLogout } = userAuthSlice.actions;

export default userAuthSlice.reducer;



// setUserId: (state, action) => {
//     state.userId = action.payload.userId
// },