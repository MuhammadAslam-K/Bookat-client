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
}

interface driverAuthSlice {
    loggedIn: boolean
    document: boolean
    vehicle: boolean
}

interface adminAuthSlice {
    loggedIn: boolean
}

export interface rootState {
    user: userAuthSlice,
    driver: driverAuthSlice,
    admin: adminAuthSlice
}