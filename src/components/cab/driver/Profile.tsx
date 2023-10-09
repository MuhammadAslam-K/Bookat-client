import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import axios, { AxiosError } from "axios"
import { useDispatch } from "react-redux";
import { driverLogout } from "../../../services/redux/slices/driverAuth";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { driverAxios } from "../../../Constraints/driverAxiosInterceptors";
import driverEndPoint from "../../../endpoints/driverEndPoint";

interface ErrorResponse {
    error: string;
}

interface driverData {

    name: string;
    mobile: string;
    refrel: string;
    isAvailable: boolean
    password: string;
    driverImageUrl: string;
    email: string;

    aadhar: {
        aadharId: string;
        aadharImage: string;
    };

    license: {
        licenseId: string;
        licenseImage: string;
    };

    driver: {
        driverDocuments: boolean;
        driverVerified: boolean;
    };

    vehicle: {
        vehicleDocuments: boolean;
        vehicleVerified: boolean;
    };

    wallet: {
        balance: number;
        transactions: IDBTransaction[];
    };
}

interface ErrorResponse {
    error: string;
}
function Profile() {

    const [driverData, setDriverData] = useState<driverData>()

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await driverAxios.post(driverEndPoint.profie)
                setDriverData(response.data)

            } catch (error) {
                console.log(error);

                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response?.data) {
                        toast.error(axiosError.response.data.error);
                        dispatch(driverLogout())
                        navigate("/driver/login")

                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchData()
    }, [])


    const handleDriverAvailable = async () => {
        try {

            const response = await driverAxios.post(driverEndPoint.available)
            console.log(response);

        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }

    return (
        <div className="flex justify-center">
            {driverData &&
                <div className="w-11/12 overflow-hidden rounded-3xl bg-white shadow-2xl mt-11 mb-11">
                    <div className="w-full">
                        <section className="bg-white ">
                            <div className="relative flex">
                                {/* SECTION ONE */}
                                <div className="min-h-screen mt-4 lg:w-1/3 flex flex-col text-center justify-center items-center">
                                    <img className="object-cover object-center w-full lg:w-[20rem] rounded-lg" src={driverData.driverImageUrl} alt="" />

                                    <div className="w-full p-7 max-w-md overflow-hidden rounded-2xlshadow-2xl sm:flex justify-center">
                                        <div className="w-full ">
                                            <div className=" ms-7 flex space-x-5">
                                                <p className="mt-2">Account Status</p>
                                                {driverData.vehicle.vehicleVerified && driverData.driver.driverVerified ?
                                                    <div className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Verifyed</div> :
                                                    <div className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600  shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Not Verifyed</div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex">

                                        <Link to={"/driver/vehicle"}>
                                            <button type="button" className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">vehicle Info</button>
                                        </Link>

                                        <label className="relative inline-flex items-center mb-6 ms-7 cursor-pointer">
                                            <input type="checkbox" value="available" className="sr-only peer" onChange={handleDriverAvailable} />
                                            <div className={`w-11 h-6 bg-gray-200 ${driverData.isAvailable ? 'bg-gray-200' : 'bg-green-600'} peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600`}></div>
                                            <span className="ml-3 font-medium text-gray-900 dark:text-gray-600">Available</span>
                                        </label>

                                    </div>
                                </div>
                                {/* SECTION TWO */}
                                <div className="hidden w-3/4 min-h-screen bg-gray-200 lg:block">

                                    <h1 className="text-2xl my-5 font-semibold flex flex-col text-center justify-center text-gray-800 capitalize lg:text-3xl dark:text-black">
                                        <span className="text-blue-500 ">{`Welcome ${driverData.name}`}</span>
                                    </h1>


                                    <div className=" lg:flex lg:items-center  ms-7">

                                        <div className="p-8 me-5 bg-white rounded-2xl w-full">
                                            <svg className="h-5 w-5 " viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />  <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />  <line x1="16" y1="5" x2="19" y2="8" /></svg>
                                            <div className="flex space-x-20 mx-3 mb-6">

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Email
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {driverData.email}
                                                    </p>

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Mobile
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {driverData.mobile}
                                                    </p>

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Refrel
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {driverData.refrel}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="flex space-x-20 mx-3 mb-6">
                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Aadhar Id
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {driverData.aadhar.aadharId}
                                                    </p>

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        license
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {driverData.license.licenseId}
                                                    </p>

                                                </div>

                                            </div>
                                            <div className="flex space-x-20 mx-3 mb-6 ">
                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Aadhar Image
                                                    </label>
                                                    <img src={driverData.aadhar.aadharImage} className="rounded-lg max-h-44" />
                                                </div>

                                                <div className="w-full md:w-4/5  px-3 mb-6 md:mb-0 ">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        license Image
                                                    </label>
                                                    <img src={driverData.license.licenseImage} className="rounded-lg max-h-44" />

                                                </div>

                                            </div>

                                        </div>


                                    </div>

                                    {/* </div> */}
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            }
        </div>
    )
}

export default Profile