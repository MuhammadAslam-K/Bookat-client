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
