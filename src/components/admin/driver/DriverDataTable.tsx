import { Suspense, lazy, useEffect, useState } from "react";
import DataTable from "react-data-table-component"


import { Modal, Ripple, initTE } from "tw-elements";
import adminApis from "../../../Constraints/apis/adminApis";
import { handleErrors } from "../../../Constraints/apiErrorHandling";
import { adminAxios } from "../../../Constraints/axiosInterceptors/adminAxiosInterceptors";
import { DriverInfo } from "../../../utils/interfaces";
import adminEndPoint from "../../../Constraints/endPoints/adminEndPoint";
import { Link } from "react-router-dom";
initTE({ Modal, Ripple });

const DriverRideHistory = lazy(() => import("./DriverRideHistory"))


export interface ErrorResponse {
    error: string;
}


function DriverDataTable() {



    const [data, Setdata] = useState<(DriverInfo)[]>()
    const [searchTerm, setSearchTerm] = useState("");

    const [driverId, SetDriverId] = useState("");

    const [reload, setReload] = useState(false);
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



    const handleBlock = async (id: DriverInfo) => {
        try {
            await adminAxios.patch(`${adminApis.blockDriver}?id=${id._id}`)
            setReload(!reload)

        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    const filteredData = data?.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const getButtonColor = (driver: DriverInfo) => {
        const red = "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  m-2"
        const blue = "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  m-2"
        return driver.block ? red : blue;
    };


    const columns = [

        {
            name: 'Name',
            selector: (row: DriverInfo) => row.name,
        },
        {
            name: 'Email',
            selector: (row: DriverInfo) => row.email,
        },
        {
            name: 'Mobile',
            selector: (row: DriverInfo) => row.mobile,
        },
        {
            name: 'Total Rides',
            selector: (row: DriverInfo) => row.RideDetails.completedRides,
        },
        {
            name: 'Vefified',
            cell: (row: DriverInfo) => (
                <p
                    className={row.driver.driverVerified && row.vehicle.vehicleVerified ? 'text-green-600 cursor-pointer' : 'text-red-600 cursor-pointer'}
                >
                    {row.driver.driverVerified && row.vehicle.vehicleVerified ?
                        <Link to={`${adminEndPoint.driverAndVehicleVerify}/?id=${row._id}`} className="text-green-600  cursor-pointer">Verified</Link >
                        :
                        <Link to={`${adminEndPoint.driverAndVehicleVerify}/?id=${row._id}`} className="text-red-600  cursor-pointer">Not Verified</Link>
                    }
                </p>

            ),
        },
        {
            name: 'Status',
            cell: (row: DriverInfo) => (
                <button
                    className={getButtonColor(row)}
                    onClick={() => handleBlock(row)}
                >
                    {row.block ? 'Unblock' : 'Block'}
                </button>

            ),
        },
        {
            name: 'View Details',
            cell: (row: DriverInfo) => (
                <p className="cursor-pointer"
                    onClick={() => { SetDriverId(row._id), setDriverDetails(true) }}
                >
                    Ride History
                </p>
            ),
        },
    ]

    return (
        <>
            {driverDetails ?
                <div>
                    <Suspense fallback={<div>Loading...</div>}>
                        <DriverRideHistory driverId={driverId} />
                    </Suspense>
                </div>
                :
                <div className="mt-10 w-10/12 ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center">

                    <input
                        type="text"
                        placeholder=" Search by Name"
                        value={searchTerm}
                        className="border-2 border-gray-400 rounded-lg p-0.5"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Suspense>
                        {filteredData && filteredData.length > 0 && (
                            <DataTable
                                style={{ zIndex: '-1' }}
                                columns={columns}
                                data={filteredData}
                                fixedHeader
                                highlightOnHover
                                pagination
                            />
                        )}
                    </Suspense>
                </div>
            }
        </>
    );
}

export default DriverDataTable