export interface userSignUp {
    name: string,
    email: string,
    mobile: string,
    password: string,
}

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


export interface DriverInfo {
    data: any;
    _id: string
    name: string;
    mobile: string;
    email: string;
    password: string;
    refrel: string;
    block: boolean;
    isAvailable: boolean;
    joiningAt: string;
    driverImageUrl: string;
    // totalRides: string;
    RideDetails: {
        completedRides: string;
    };
    driver: {
        driverVerified: boolean;
        driverDocuments: boolean;
    };
    vehicle: {
        vehicleVerified: boolean;
        vehicleDocuments: boolean;
    };
    wallet: {
        balance: number;
        transactions: {
            date: Date;
            details: string;
            amount: number;
            status: string;
        }[];
    };
    aadhar: {
        aadharId: string;
        aadharImage: string;
    };
    license: {
        licenseId: string;
        licenseImage: string;
    };
    vehicleDocuments: {
        registration: {
            registrationId: string;
            registrationImage: string;
        };
        vehicleModel: string;
        maxPersons: string;
        vehicleType: string;
        vehicleImage1: string;
        vehicleImage2: string;
    };
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

export interface driverProfile {
    data: SetStateAction<driverInfo | null>;
    name: string,
    email: string,
    mobile: string,
    aadharId: string,
    licenseId: string,
    aadharImageUrl: string,
    licenseImageUrl: string,
    driverImageUrl: string,
    vehicleVerified: string,
    driverVerified: string,
    refrel: string,
    isAvailable: boolean,
    totalRides: string,
    joinedAt: string,
    vehicleDocuments: {
        vehicleModel: string
        registration: {
            registrationId: string
        }
    }
}