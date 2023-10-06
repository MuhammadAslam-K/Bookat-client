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