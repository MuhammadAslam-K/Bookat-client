import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { adminAxios } from '../../../Constraints/axiosInterceptors/adminAxiosInterceptors';
import adminApis from '../../../Constraints/apis/adminApis';
import { DriverInfo } from '../../../utils/interfaces';

import { Modal, Ripple, initTE } from "tw-elements";
import { customLoadingStyle } from '../../../Constraints/customizeLoaderStyle';
import { handleErrors } from '../../../Constraints/apiErrorHandling';
initTE({ Modal, Ripple });


function DriverAndVehicleValidation(props: { id: string | null }) {

    const { id } = props
    const [data, Setdata] = useState<DriverInfo>()
    const [personal, setPersonal] = useState<string>("");
    const [vehicle, setVehicle] = useState<string>("");

    const [personaInfoModal, SetPerssonalInfoModal] = useState(false)
    const [vehicleInfoModal, SetVehicleInfoModal] = useState(false)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: DriverInfo = await adminAxios.get(`${adminApis.getDriverInfo}/?id=${id}`)
                Setdata(response.data)

            } catch (error) {
                handleErrors(error)
            }
        }
        fetchData()
    }, [])


    const handleRejectPersonalInfo = async () => {
        try {
            const value = {
                email: data?.email,
                reason: personal,
                id: id
            }
            toast.loading('Rejecting...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.rejectDriver, value)
            toast.dismiss()
            toast.success("Rejected Successfully")
            setPersonal("")
            SetPerssonalInfoModal(false)
        } catch (error) {
            handleErrors(error)
        }
    }

    const handleRejectVehicleInfo = async () => {
        try {
            const value = {
                email: data?.email,
                reason: vehicle,
                id: id
            }
            toast.loading('Rejecting...', {
                style: customLoadingStyle,
            });
            await adminAxios.post(adminApis.rejectVehicle, value)
            toast.dismiss()
            toast.success("Rejected Successfully")
            SetVehicleInfoModal(false)
            setVehicle("")

        } catch (error) {
            handleErrors(error)
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
            handleErrors(error)
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
            handleErrors(error)
        }
    }

    return (
        <>

            {personaInfoModal &&

                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                        <h1 className='text-center font-semibold text-2xl'>Enter the Reason</h1>

                        <div className="relative flex-auto text-center p-4" data-te-modal-body-ref>
                            <textarea name="reason"
                                placeholder='  Enter here...'
                                required
                                onChange={(e) => setPersonal(e.target.value)}
                                className='w-11/12 bg-white text-blue rounded-lg shadow-lg border border-blue' ></textarea>
                        </div>

                        <div className="flex ms-10 w-96">
                            <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => handleRejectPersonalInfo()}>submit</button>
                            <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => SetPerssonalInfoModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }


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
                                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={() => SetPerssonalInfoModal(true)}>Reject</button>

                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* VEHICLE INFO  MODAL*/}



            {vehicleInfoModal &&
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                    <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                        <h1 className='text-center font-semibold text-2xl'>Enter the Reason</h1>

                        <div className="relative flex-auto text-center p-4" data-te-modal-body-ref>
                            <textarea name="reason"
                                placeholder='  Enter here...'
                                required
                                onChange={(e) => setVehicle(e.target.value)}
                                className='w-11/12 bg-white text-blue rounded-lg shadow-lg border border-blue' ></textarea>
                        </div>

                        <div className="flex ms-10 w-96">
                            <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => handleRejectVehicleInfo()}>submit</button>
                            <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => SetVehicleInfoModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }

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
                                            onClick={() => SetVehicleInfoModal(true)}
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