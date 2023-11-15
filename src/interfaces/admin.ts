export interface adminListAllCabs {
    _id: string,
    cabType: string,
    maxPersons: string,
    price: string,
    available: string,
    drivers: string[]
}

export interface adminUserDataTable {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    block: boolean;
    RideDetails: {
        completedRides: number;
    }
}

export interface AdminDashboard {
    driverData: {
        RideDetails: {
            completedRides: string
        },
        revenue: string
    }
    totalRide: string,
    quickRidesCount: string,
    scheduledRidesCount: string,
    quickRides: rides[]
    scheduledRides: rides[]
}

interface rides {
    date: string
}

export interface driverRideHistory {
    _id: string;
    status: string;
    date: string;
    distance: string;
    dropoffLocation: string;
    pickupLocation: string;
    driverRevenu: number;
    rating: number;
}