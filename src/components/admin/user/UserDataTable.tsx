import { Suspense, useEffect, useState } from "react";
import { Modal, Ripple, initTE } from "tw-elements";
import { adminAxios } from "../../../Constraints/axiosInterceptors/adminAxiosInterceptors";
import adminApis from "../../../Constraints/apis/adminApis";
import { handleErrors } from "../../../Constraints/apiErrorHandling";
initTE({ Modal, Ripple });
import DataTable from "react-data-table-component"
import UserDetails from "./UserDetails";
import { adminUserDataTable } from "../../../interfaces/admin";





function UserDataTable() {

    const [data, Setdata] = useState<(adminUserDataTable)[]>()

    const [searchTerm, setSearchTerm] = useState("");
    const [userId, SetUserId] = useState("");

    const [reload, setReload] = useState(false);
    const [userDetails, setUserDetails] = useState(false);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminAxios.get(adminApis.getAllUsers)
                console.log(response);

                const Data: adminUserDataTable[] = response.data;
                Setdata(Data)
            } catch (error) {
                handleErrors(error)
            }
        }
        fetchData()
    }, [reload])



    const filteredData = data?.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const handleBlock = async (id: adminUserDataTable) => {

        try {
            await adminAxios.patch(`${adminApis.blockUser}?id=${id._id}`)

            setReload(!reload)
        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    const getButtonColor = (user: adminUserDataTable) => {
        const red = "text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  m-2"
        const blue = "text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center  m-2"
        return user.block ? red : blue;
    };


    const columns = [

        {
            name: 'Name',
            selector: (row: adminUserDataTable) => row.name,
        },
        {
            name: 'Email',
            selector: (row: adminUserDataTable) => row.email,
        },
        {
            name: 'Mobile',
            selector: (row: adminUserDataTable) => row.mobile,
        },
        {
            name: 'Status',
            cell: (row: adminUserDataTable) => (
                <button
                    className={getButtonColor(row)}
                    onClick={() => handleBlock(row)}
                >
                    {row.block ? 'Unblock' : 'Block'}
                </button>

            ),
        },
        {
            name: 'Completed Rides',
            selector: (row: adminUserDataTable) => row.RideDetails.completedRides,
        },
        {
            name: 'View Details',
            cell: (row: adminUserDataTable) => (
                <p className="cursor-pointer"
                    onClick={() => { setUserDetails(true), SetUserId(row._id) }}
                >
                    More Details
                </p>
            ),
        },
    ]

    return (
        <>
            {userDetails ?
                <div>
                    {/* <Suspense fallback={<div>Loading...</div>}> */}
                    <UserDetails userId={userId} />
                    {/* </Suspense> */}
                </div>
                :
                <div className="mt-10 lg:w-10/12 w-full lg:ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center ">

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


export default UserDataTable