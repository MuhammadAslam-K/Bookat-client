// import axios, { AxiosError } from "axios";
// import { useEffect } from "react";
// import toast from "react-hot-toast";



// interface ErrorResponse {
//     error: string;
// }

function VehicleInfo() {

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const token = localStorage.getItem("driverToken")
    //             if (!token) {
    //                 toast.error("Unautherized user please signIn ")
    //             }
    //             else {
    //                 console.log(typeof (token));

    //                 const response = await axios.post("http://localhost:8000/driver/getVehicle", token, {
    //                     headers: {
    //                         'Authorization': `Bearer ${token}`
    //                     }
    //                 })
    //                 setDriverData(response.data)

    //             }
    //         } catch (error) {
    //             console.log(error);

    //             if (axios.isAxiosError(error)) {
    //                 const axiosError: AxiosError<ErrorResponse> = error;
    //                 if (axiosError.response?.data) {
    //                     toast.error(axiosError.response.data.error);
    //                     // if(axiosError.response.data.error == "jwt expire")
    //                     dispatch(driverLogout())
    //                     navigate("/driver/login")

    //                 } else {
    //                     toast.error('Network Error occurred.');
    //                 }
    //             }
    //         }
    //     }
    //     fetchData()
    // }, [])

    return (
        <>
            <div className="flex justify-center">

                <div className="w-11/12 overflow-hidden rounded-3xl shadow-2xl mt-11 mb-11">
                    <div className="w-full">
                        <section className="rounded-3xl">
                            <div className=" lg:flex lg:items-center  ms-7">

                                <div className="p-8 me-5 bg-white rounded-2xl w-full">
                                    <div className="flex space-x-20 mx-3 mb-6">
                                        <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                Vehicle Type
                                            </label>
                                            <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                hfhf
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 me-5 bg-white rounded-2xl w-full">
                                    <div className="flex space-x-20 mx-3 mb-6">
                                        <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                Vehicle Model
                                            </label>
                                            <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                hfhf
                                            </p>

                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 me-5 bg-white rounded-2xl w-full">
                                    <div className="flex space-x-20 mx-3 mb-6">
                                        <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                Max Persons
                                            </label>
                                            <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                hfhf
                                            </p>

                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="flex space-x-20 mx-3 my-8 mb-6 ">
                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Vehicle Image
                                    </label>
                                    <img src="data:image/jpeg;base64,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" alt="" />
                                </div>

                                <div className="w-full md:w-4/5  px-3 mb-6 md:mb-0 ">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                        Vehicle Image
                                    </label>
                                    <img src="data:image/jpeg;base64,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" alt="" />
                                </div>

                            </div>
                        </section>
                    </div>
                </div>
            </div>

        </>
    )
}

export default VehicleInfo

