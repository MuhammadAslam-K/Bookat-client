export interface ErrorResponse {
    error: string;
}

export interface RideHistoryRide {
    _id: string;
    status: string;
    date: string;
    distance: string;
    dropoffLocation: string;
    pickupLocation: string;
    price: number;
    rating: number;
}


export interface OtpProps {
    mobile: string;
    submitSignUpForm: () => Promise<void>;
}

export interface BarChartProps {
    months: string[];
    userCounts: number[];
}

export interface Message {
    sender: string;
    content: string;
    timestamp: Date;
}

export interface chat {
    rideId: string;
    handleChangeTheChatState: () => void
    role: string
}


// ROUTE
export interface RouteProps {
    component: React.FC;
}

// AUTH

export interface loginComponentProps {
    loginserver: string,
    signup: string,
    resetpassword: string,
    person: string,
}

export interface signupComponentProps {
    login: string;
    signupSuccess: string;
    signupServer: string;
    checkExists: string,
    person: string,
}

// REDUX

interface userAuthSlice {
    loggedIn: boolean
    userId: null | string,
    mobile: null | string
}

interface driverAuthSlice {
    loggedIn: boolean
    document: boolean
    vehicle: boolean
    driverId: null | string;
    vehicleType: null | string
    available: boolean
}

interface adminAuthSlice {
    loggedIn: boolean
}

export interface rootState {
    user: userAuthSlice,
    driver: driverAuthSlice,
    admin: adminAuthSlice
}

