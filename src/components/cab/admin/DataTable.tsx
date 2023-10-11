import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminAxios } from "../../../Constraints/adminAxiosInterceptors";
import { adminLogout } from "../../../services/redux/slices/adminAuth";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { DriverInfo, UserInfo } from "../../../utils/interfaces";


import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });


interface ErrorResponse {
    error: string;
}


function DataTable(props: { blockEndpoint: string, getData: string, role: string }) {
    const { blockEndpoint, getData, role } = props

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [data, Setdata] = useState<(DriverInfo | UserInfo)[]>()
    const [block, Setblock] = useState(false)
    const [Id, SetId] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await adminAxios.get(getData)
                const Data: (DriverInfo | UserInfo)[] = response.data;
                Setdata(Data)

            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;

                    if (axiosError.response?.data.error == "jwt expired") {

                        toast.error("Sorry, your login session has timed out. Kindly log in again")
                        dispatch(adminLogout())
                        navigate("/admin/login")
                    }
                    if (axiosError.response) {
                        toast.error(axiosError.response.data.error);
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchData()
    }, [dispatch, navigate, block, getData])

    const handleBlock = async () => {

        try {
            const value = { id: Id }
            await adminAxios.post(blockEndpoint, value)
            Setblock(!block)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response?.data.error == "jwt expired") {
                    toast.error("Sorry, your login session has timed out. Kindly log in again")
                    dispatch(adminLogout())
                    navigate("/admin/login")
                }
                else if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }


    return (
        <>
            <div className="flex h-screen justify-center mt-9" >


                <div
                    data-te-modal-init
                    className="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
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

                            {/* <!--Modal body--> */}
                            <div className="relative flex-auto text-center p-4" data-te-modal-body-ref>
                                Are you sure you ?
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
                                    onClick={() => handleBlock()}
                                    data-te-modal-dismiss
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                                <table className="w-full text-sm text-left text-white  dark:text-white">
                                    <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-slate-500 dark:text-white border-b-white border-4 font-bold">

                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                User Name
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Email Id
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Phone No
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Total Rides
                                            </th>
                                            {role == "driver" &&
                                                <th scope="col" className="px-6 py-3">
                                                    Status
                                                </th>
                                            }
                                            <th scope="col" className="px-6 py-3">
                                                Block
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                View Details
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>

                                        {data && data.map((items) => (
                                            <tr key={items._id} className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {items.name}
                                                </th>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.email}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.mobile}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.totalRides}
                                                </td>
                                                {role === "driver" &&
                                                    "driver" in items && (
                                                        <td className="px-6 py-4 dark:text-white">
                                                            {items.driver.driverVerified && items.vehicle.vehicleVerified
                                                                ? <Link to={`/admin/verify/?id=${items._id}`} className="text-green-600 font-semibold cursor-pointer">Verified</Link >
                                                                : <Link to={`/admin/verify/?id=${items._id}`} className="text-red-600 font-semibold cursor-pointer">Not Verified</Link>
                                                            }
                                                        </td>
                                                    )}
                                                <td className="px-6 py-4 dark:text-white" onClick={() => SetId(items._id)}>
                                                    {items.block ? <button type="button"
                                                        data-te-toggle="modal"
                                                        data-te-target="#exampleModal"
                                                        data-te-ripple-init
                                                        data-te-ripple-color="light"
                                                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Block</button>
                                                        :
                                                        <button type="button"
                                                            data-te-toggle="modal"
                                                            data-te-target="#exampleModal"
                                                            data-te-ripple-init
                                                            data-te-ripple-color="light"
                                                            className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Unblock</button>
                                                    }
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    view Details
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

export default DataTable