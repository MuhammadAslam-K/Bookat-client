import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";


import { userAuthSlice } from "./slices/userAuth"
import { driverAuthSlice } from "./slices/driverAuth"
import { adminAuthSlice } from "./slices/adminAuth"


const userPersistConfig = { key: "userAuth", storage, version: 1 };
const driverPersistConfig = { key: "driverAuth", storage, version: 1 };
const adminPersistConfig = { key: "adminAuth", storage, version: 1 };


const userAuthPersistReducer = persistReducer(userPersistConfig, userAuthSlice.reducer);
const driverAuthPersistReducer = persistReducer(driverPersistConfig, driverAuthSlice.reducer);
const adminAuthPersistReducer = persistReducer(adminPersistConfig, adminAuthSlice.reducer);


export const store = configureStore({
    reducer: {
        user: userAuthPersistReducer,
        driver: driverAuthPersistReducer,
        admin: adminAuthPersistReducer,
    },


    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        });
        return middleware;
    },
})

export const persistor = persistStore(store);