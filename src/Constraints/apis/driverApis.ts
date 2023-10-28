export default {
    // AUTH
    login: "/driver/login",
    signUp: "/driver/signup",
    chekDriverExists: "/driver/check/driverExists",

    sendOtp: "/otp",
    verifyOtp: "/otp/verify",
    resetPasswordLink: "/driver/resetPasswordLink",
    resetPassword: "/driver/resetpassword",

    // ADD DOCUMNETS
    addPersonalInfo: "/driver/info/personal",
    addVehicleInfo: "/driver/info/vehicle",

    // PROFILE
    available: "/driver/available",
    profie: "/driver/profile",
    updateProfile: "/driver/update/profile",

    // VEHICLE
    vehicle: "/driver/vehicle",
    updateVehicle: "/driver/update/vehicle",
    // DETAILS FOR RIDE
    getUserInfo: "/driver/getUser",
    getRideDetails: "/getridedata",

    // HISTORY
    getRideHistory: "/driver/history",

    rideHistory: "/driver/rideHistory",
    scheduleRideHistory: "/driver/scheduleRideHistory",

    // DATA FOR CURRENT RIDES
    currentRide: "/driver/currentRide",
    scheduleRidePending: "/driver/scheduleRidePending",

    scheduleRideNotification: "/driver/scheduleRideNotification",
    scheduleRideConfirmation: "/driver/scheduleRideConfirmation",

    sendOtpForStartingRide: "/driver/startingRideOtp",
    startScheduledRide: "/driver/startScheduledRide",

    // DASHBOARD
    dashboard: "/driver/dashboard"
}

