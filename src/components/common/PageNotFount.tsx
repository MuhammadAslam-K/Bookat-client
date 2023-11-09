import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userEndPoints from "../../Constraints/endPoints/userEndPoints";
import driverEndPoints from "../../Constraints/endPoints/driverEndPoints";
import adminEndPoint from "../../Constraints/endPoints/adminEndPoint";

const NotFound = (props: { role: string }) => {

    const { role } = props
    const [homeUrl, setHomeUrl] = useState<string>("")

    useEffect(() => {
        if (role == "user") {
            setHomeUrl(userEndPoints.home)
        } else if (role == "driver") {
            setHomeUrl(driverEndPoints.dashboard)
        } else if (role == "admin") {
            setHomeUrl(adminEndPoint.dashboard)
        }

    }, [])

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="text-center text-white">
                <h1 className="text-4xl font-semibold mb-4">404 - Page Not Found</h1>
                <p className="text-lg mb-8">The page you are looking for does not exist.</p>
                <div className="animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-300 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <div className="animate-pulse my-4">
                    <p className="text-lg">Don't worry, you can return to safety by clicking <Link className="text-blue-400 hover:underline" to={homeUrl}>here</Link>.</p>
                </div>
                <div className="animate-wiggle my-4">
                    <p className="text-lg">Or explore more on our <Link className="text-blue-400 hover:underline" to={homeUrl}>homepage</Link>.</p>
                </div>
                <div className="animate-bounce my-4">
                    <p className="text-lg">Let's find your way back with this fun bounce.</p>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
