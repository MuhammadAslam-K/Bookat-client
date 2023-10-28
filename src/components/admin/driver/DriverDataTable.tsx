import { Suspense, lazy, useEffect, useState } from "react";
import { Link, } from "react-router-dom";


import { Modal, Ripple, initTE } from "tw-elements";
import adminApis from "../../../Constraints/apis/adminApis";
import { handleErrors } from "../../../Constraints/apiErrorHandling";
import { adminAxios } from "../../../Constraints/axiosInterceptors/adminAxiosInterceptors";
import { DriverInfo } from "../../../utils/interfaces";
import adminEndPoint from "../../../Constraints/endPoints/adminEndPoint";
initTE({ Modal, Ripple });

const DriverRideHistory = lazy(() => import("./DriverRideHistory"))


export interface ErrorResponse {
    error: string;
}


function DriverDataTable() {



    const [data, Setdata] = useState<(DriverInfo)[]>()
    const [Id, SetId] = useState("")
    const [searchTerm, setSearchTerm] = useState("");

    const [driverId, SetDriverId] = useState("");

    const [reload, setReload] = useState(false);
    const [modal, setModal] = useState(false);
    const [driverDetails, setDriverDetails] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(35)
                const response = await adminAxios.get(adminApis.getDrivers)
                console.log(response);
                const Data: (DriverInfo)[] = response.data;
                Setdata(Data)

            } catch (error) {
                console.log("fetchData", error)
                handleErrors(error)
            }
        }
        fetchData()
    }, [reload])

    const filterData = () => {
        console.log(searchTerm)
        if (searchTerm == "") {
            setReload(!reload)
        }
        const filteredData = data?.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        console.log("filteredData", filteredData)
        Setdata(filteredData)
    }



    const handleBlock = async () => {
        try {
            const value = { id: Id }
            await adminAxios.post(adminApis.blockDriver, value)
            setReload(!reload)
            setModal(!modal)

        } catch (error) {
            handleErrors(error)
        }
    }


    return (
        <>
            {driverDetails ?
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DriverRideHistory driverId={driverId} />
                    </Suspense>
                </div>
                :

                <div className="flex h-screen justify-center mt-9" >

                    {modal &&

                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                            <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                                <h1 className='text-center font-semibold text-2xl'>Are You Sure</h1>

                                <div className="mt-5 w-60 flex justify-center">
                                    <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => handleBlock()}>Confirm</button>
                                    <button type='button' className='p-2 px-3 border border-slate-600 rounded-lg m-2' onClick={() => setModal(!modal)} >cancel</button>
                                </div>
                            </div>
                        </div>
                    }

                    <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full ">
                            <div className="p-8">
                                <div className="p-8">
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            filterData();
                                        }}
                                        className="w-full px-4 py-2 mb-4 border rounded-lg"
                                    />
                                </div>
                                <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                                    <table className="w-full text-sm text-left text-white  dark:text-white">
                                        <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-slate-500 dark:text-white border-b-white border-4 font-bold">

                                            <tr>
                                                <th scope="col" className="px-6 py-3">
                                                    Name
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
                                                <th scope="col" className="px-6 py-3">
                                                    Status
                                                </th>
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
                                                    <th scope="row" className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                        {items.name}
                                                    </th>
                                                    <td className="px-2 py-2 dark:text-white">
                                                        {items.email}
                                                    </td>
                                                    <td className="px-2 py-2 dark:text-white">
                                                        {items.mobile}
                                                    </td>
                                                    <td className="px-2 py-2 dark:text-white">
                                                        {items.RideDetails.completedRides}
                                                    </td>
                                                    <td className="px-2 py-2 dark:text-white">
                                                        {items.driver.driverVerified && items.vehicle.vehicleVerified
                                                            ? <Link to={`${adminEndPoint.driverAndVehicleVerify}/?id=${items._id}`} className="text-green-600 font-semibold cursor-pointer">Verified</Link >
                                                            : <Link to={`${adminEndPoint.driverAndVehicleVerify}/?id=${items._id}`} className="text-red-600 font-semibold cursor-pointer">Not Verified</Link>
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2 dark:text-white" onClick={() => { SetId(items._id); setModal(!modal) }}>
                                                        {items.block ?
                                                            <button type="button"
                                                                className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Unblock</button>
                                                            :
                                                            <button type="button"
                                                                className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Block</button>
                                                        }
                                                    </td>
                                                    <td className="px-2 py-2 dark:text-white cursor-pointer"
                                                        onClick={() => { SetDriverId(items._id), setDriverDetails(true) }}
                                                    >
                                                        Ride History
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
            }
        </>
    );
}

export default DriverDataTable