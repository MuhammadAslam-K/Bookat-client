export interface DateTimePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectDate: (date: Date) => void;
    handleScheduleBooking: () => void
}

export interface userRideHistory {
    _id: string;
    status: string;
    date: string;
    distance: string;
    dropoffLocation: string;
    pickupLocation: string;
    price: number;
    vehicleType: string;
    favourite: boolean
}

export interface LocationSuggestion {
    text: string;
    place_name: string;
}

export interface cabDataUser {
    cabType: string,
    maxPersons: string,
    price: string,
    image: string,
    drivers: []
}

export interface UserProfileData {
    email: string;
    mobile: string;
    name: string;
    refrel: string;
    totalRides: string;
    joinedAt: string;
    wallet: {
        balance: string;
    };

}

export interface wallet {
    date: Date,
    amount: string,
    status: string,
    details: string,
}


export interface feedback {
    feedback: string
    rating: string
    _id: string
}

export interface driverData {
    name: string
    mobile: string
    email: string
    RideDetails: {
        completedRides: string
    },
    vehicleDocuments: {
        vehicleModel: string
        registration: {
            registrationId: string,
            registrationImage: string
        }
        vehicleImage1: string
        vehicleImage2: string
    }
    license: {
        licenseId: string
        licenseImage: string
    }
    joinedAt: string,
    driverImageUrl: string
}

export interface rideDetail {
    driverAccepted: string;
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driver_id: string,
}


// PAYMENT
declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any;
    }
}

export interface RazorpayOptions {
    key: string;
    currency: string;
    amount: number;
    name: string;
    prefill: {
        name: string;
    };
    handler?: (response: { razorpay_payment_id: unknown }) => void;
}

export interface userSignUp {
    name: string,
    email: string,
    mobile: string,
    password: string,
}



export interface UserInfo {
    _id: string
    name: string;
    mobile?: string;
    email: string;
    password?: string;
    refrel: string;
    block: boolean;
    joiningAt: string;
    // totalRides: number;
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    RideDetails: {
        completedRides: string;
    };
}