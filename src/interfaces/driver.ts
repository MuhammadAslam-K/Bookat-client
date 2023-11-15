export interface driverDashboard {
    totalDriversCount: string
    totalQuickRidesCount: string
    totalRidesCount: string
    totalScheduledRidesCount: string
    totalUsersCount: string
    totalUsers: totalUsers[]
    totalDrivers: totalUsers[]
    totalQuickRides: rides[]
    totalScheduledRides: rides[]
}

interface totalUsers {
    joinedAt: string;
}
interface rides {
    date: string;
}

export interface driverVehicleDocuments {
    registrationId: string,
    rcImageUrl: string,
    vehicleModel: string,
    maxPersons: string,
    vehicleType: string,
    vehicleImageUrl1: string,
    vehicleImageUrl2: string,
}

export interface driverCab {
    cabType: string
}


export interface quickRideDetails {
    driverId: string
    userId: string
    userLat: string
    userLon: string
}

export interface scheduledRideDetails {
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driverAccepted: string,
    pickUpDate: string
    vehicleType: string
}

export interface RideConfirmProps {
    amount: string
    userFromLocation: string
    userToLocation: string
    rideDistance: string
    distance: string

}

export interface rideDetail {
    _id: string;
    pickupLocation: string,
    dropoffLocation: string,
    price: string,
    distance: string,
    status: string,
    driver_id: string,
}

export interface userInfoMobile {
    mobile: string
}


export interface driverData {
    name: string
    // totalRides: string,
    RideDetails: {
        completedRides: string
    },
    vehicleDocuments: {
        vehicleModel: string
        registration: {
            registrationId: string
        }
    }
    joinedAt: string,
    driverImageUrl: string
}

export interface rideDetails {
    _id: string;
    driver_id: string;
    user_id: string;
    driverCoordinates: {
        latitude: string;
        longitude: string;
    };
    dropoffCoordinates: {
        latitude: string;
        longitude: string;
    };
    pickupCoordinates: {
        latitude: string;
        longitude: string;
    };
    dropoffLocation: string;
    pickupLocation: string;
    price: string;
    distance: string;
    otpVerifyed: boolean;
}

export interface commnet {
    feedback: string
    rating: string
}
