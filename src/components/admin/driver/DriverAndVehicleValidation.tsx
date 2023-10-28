import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { adminAxios } from '../../../Constraints/axiosInterceptors/adminAxiosInterceptors';
import adminApis from '../../../Constraints/apis/adminApis';
import { DriverInfo } from '../../../utils/interfaces';

import { Modal, Ripple, initTE } from "tw-elements";
import { customLoadingStyle } from '../../../Constraints/customizeLoaderStyle';
initTE({ Modal, Ripple });

interface ErrorResponse {
    error: string;
}


function DriverAndVehicleValidation(props: { id: string | null }) {

    const { id } = props
    const [data, Setdata] = useState<DriverInfo>()
    const [personal, setPersonal] = useState<string>("");
    const [vehicle, setVehicle] = useState<string>("");


    useEffect(() => {
        const fetchData = async () => {
            try {

                const response: DriverInfo = await adminAxios.post(adminApis.getDriverInfo, { id: id })
                Setdata(response.data)

            } catch (error) {
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
        fetchData()
    }, [])


    const handleRejectPersonalInfo = async () => {
        try {
            const value = {
                email: data?.email,
                reason: personal
            }
            toast.loading('Rejecting...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.rejectDriver, value)
            toast.dismiss()
            toast.success("Rejected Successfully")
            setPersonal("")
        } catch (error) {
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

    const handleRejectVehicleInfo = async () => {
        try {
            const value = {
                email: data?.email,
                reason: vehicle
            }
            toast.loading('Rejecting...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.rejectVehicle, value)
            toast.dismiss()
            toast.success("Rejected Successfully")
            setVehicle("")

        } catch (error) {
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

    const handleApprovePersonalInfo = async () => {
        try {
            const value = {
                id: id,
                email: data?.email
            }
            toast.loading('Approving...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.approveDriver, value)
            toast.dismiss()
            toast.success("Approved Successfully")
        } catch (error) {
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

    const handleApproveVehicleInfo = async () => {
        try {
            const value = {
                id: id,
                email: data?.email
            }
            toast.loading('Approving...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.approveVehicle, value)
            toast.dismiss()
            toast.success("Approved Successfully")
        } catch (error) {
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
        <>
            {/* PERSONAL INFO  MODAL*/}

            <div
                data-te-modal-init
                className="fixed left-0 top-0 z-[1055] hidden  w-full h-full overflow-y-auto overflow-x-hidden outline-none"
                id="exampleModal"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div
                    data-te-modal-dialog-ref
                    className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                >
                    <div
                        className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col border-none bg-white bg-clip-padding text-current shadow-lg outline-none rounded-lg"
                    >
                        <div
                            className="flex flex-shrink-0 items-center justify-between border-neutral-100 border-opacity-100 p-4 dark:border-opacity-100"
                        >
                            <button
                                type="button"
                                className="box-content mt-2 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                data-te-modal-dismiss
                                aria-label="Close"
                            >
                            </button>
                        </div>
                        <h5
                            className="text-xl font-medium text-center leading-normal text-neutral-800 dark:text-neutral-500"
                            id="staticBackdropLabel">
                            Please Enter the Reason
                        </h5>
                        {/* <!--Modal body--> */}
                        <div className="relative flex-auto text-center p-4" data-te-modal-body-ref>
                            <textarea name="reason"
                                placeholder='  Enter here...'
                                required
                                onChange={(e) => setPersonal(e.target.value)}
                                className='w-3/4 bg-white text-blue rounded-lg shadow-lg border border-blue' ></textarea>
                        </div>

                        {/* <!--Modal footer--> */}
                        <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                data-te-modal-dismiss
                                data-te-ripple-init
                                data-te-ripple-color="light"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                onClick={() => handleRejectPersonalInfo()}
                                data-te-modal-dismiss
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* PERSONAL INFO */}

            {data &&
                <div className="flex  h-full justify-center bg-gray-100">

                    <div className="w-10/12 mt-16 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full">
                            <h1 className="text-3xl text-center font-black text-blue mt-6">Personal Info</h1>
                            <div className="p-8">
                                <form className="mt-8">

                                    <div className="my-6 flex flex-wrap justify-around">

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Name: {data.name}
                                        </label>

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Email Id: {data.email}
                                        </label>

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Mobile No: {data.mobile}
                                        </label>
                                    </div>

                                    <div className="mt-16 flex flex-wrap justify-around">


                                        <label className="flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            License ID: {data.license.licenseId}
                                        </label>
                                        <label className="flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            AAdhar ID: {data.aadhar.aadharId}
                                        </label>

                                    </div>

                                    <div className="my-11 flex justify-around">

                                        <div className="w-11/12 sm:w-2/3 lg:w-1/3 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover-bg-slate-100">
                                            <img src={data.license.licenseImage} className="w-full  max-h-64" alt="" />
                                        </div>
                                        <div className="w-11/12 sm:w-2/3 lg:w-1/3 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover-bg-slate-100">
                                            <img src={data.aadhar.aadharImage} className="w-full  max-h-64" alt="" />
                                        </div>
                                    </div>
                                    <div className="w-11/12 sm:w-2/3 lg:w-1/3 ms-24 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover-bg-slate-100">
                                        <img src={data.driverImageUrl} className="w-full max-h-64" alt="" />
                                    </div>


                                    <div className="flex justify-end">
                                        <button type="button" className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                            onClick={handleApprovePersonalInfo}
                                        >Approve</button>
                                        <button type="button"
                                            data-te-toggle="modal"
                                            data-te-target="#exampleModal"
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Reject</button>

                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* VEHICLE INFO  MODAL*/}

            <div
                data-te-modal-init
                className="fixed left-0 top-0 z-[1055] hidden  w-full h-full overflow-y-auto overflow-x-hidden outline-none"
                id="exampleModal"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div
                    data-te-modal-dialog-ref
                    className="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]"
                >
                    <div
                        className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col border-none bg-white bg-clip-padding text-current shadow-lg outline-none rounded-lg"
                    >
                        <div
                            className="flex flex-shrink-0 items-center justify-between border-neutral-100 border-opacity-100 p-4 dark:border-opacity-100"
                        >
                            <button
                                type="button"
                                className="box-content mt-2 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                data-te-modal-dismiss
                                aria-label="Close"
                            >
                            </button>
                        </div>
                        <h5
                            className="text-xl font-medium text-center leading-normal text-neutral-800 dark:text-neutral-500"
                            id="staticBackdropLabel">
                            Please Enter the Reason
                        </h5>
                        {/* <!--Modal body--> */}
                        <div className="relative flex-auto text-center p-4" data-te-modal-body-ref>
                            <textarea name="reason"
                                placeholder='  Enter here...'
                                required
                                onChange={(e) => setVehicle(e.target.value)}
                                className='w-3/4 bg-white text-blue rounded-lg shadow-lg border border-blue' ></textarea>
                        </div>

                        {/* <!--Modal footer--> */}
                        <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                            <button
                                type="button"
                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                data-te-modal-dismiss
                                data-te-ripple-init
                                data-te-ripple-color="light"
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                onClick={() => handleRejectVehicleInfo()}
                                data-te-modal-dismiss
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* VEHICLE INFO  */}

            {data &&
                <div className="flex  h-full justify-center bg-gray-100">
                    <div className="w-10/12 mt-16 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full">
                            <h1 className="text-3xl text-center font-black text-blue mt-6">Vehicle Info</h1>
                            <div className="p-8">
                                <form className="mt-8">

                                    <div className="my-6 flex flex-wrap justify-around">

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Vehicle Model: {data.vehicleDocuments.vehicleModel}
                                        </label>

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Vehicle Type: {data.vehicleDocuments.vehicleType}
                                        </label>

                                        <label className="flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Max peoples: {data.vehicleDocuments.maxPersons}
                                        </label>
                                    </div>

                                    <div className="mt-16 ms-28 flex flex-wrap justify-start">
                                        <label className="w-full sm:w-1/2 lg:w-1/3 flex flex-col items-center px-4 py-3 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                            Registration No: {data.vehicleDocuments.registration.registrationId}
                                        </label>

                                    </div>

                                    <div className="my-11 flex justify-around">
                                        <div className="w-11/12 sm:w-2/3 lg:w-1/3 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover:bg-slate-100">
                                            <img src={data.vehicleDocuments.registration.registrationImage} className="w-full max-h-64" alt="" />
                                        </div>
                                        <div className="w-11/12 sm:w-2/3 lg:w-1/3 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover-bg-slate-100">
                                            <img src={data.vehicleDocuments.vehicleImage1} className="w-full max-h-64" alt="" />
                                        </div>
                                    </div>
                                    <div className="w-11/12 sm:w-2/3 lg:w-1/3 ms-24 bg-white text-blue rounded-lg shadow-2xl tracking-wide border-4 border-blue cursor-pointer hover-bg-slate-100">
                                        <img src={data.vehicleDocuments.vehicleImage2} className="w-full max-h-64" alt="" />
                                    </div>

                                    <div className="flex justify-end">
                                        <button type="button"
                                            onClick={handleApproveVehicleInfo}
                                            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Approve</button>
                                        <button type="button"
                                            data-te-toggle="modal"
                                            data-te-target="#exampleModal"
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Reject</button>

                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            }
        </>

    )
}

export default DriverAndVehicleValidation