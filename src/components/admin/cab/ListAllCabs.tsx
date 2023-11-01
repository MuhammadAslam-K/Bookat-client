import { Suspense, lazy, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { handleErrors } from "../../../Constraints/apiErrorHandling"
import { adminAxios } from "../../../Constraints/axiosInterceptors/adminAxiosInterceptors"
import adminApis from "../../../Constraints/apis/adminApis"


const AddCabModal = lazy(() => import("./addCabModal"))
const EditCabModal = lazy(() => import('./EditCabModal'))

interface cab {
    _id: string,
    cabType: string,
    maxPersons: string,
    price: string,
    available: string,
    drivers: string[]
}

function ListAllCabs() {

    const [cabData, SetCabData] = useState<cab[]>()
    const [cabId, SetCabId] = useState<string>('')

    const [addCabModal, SetAddCabModal] = useState(false)
    const [handleCabEditModal, SetHandleCabEditModal] = useState(false)
    const [reload, SetReload] = useState(false)


    useEffect(() => {
        fetchTheCabs()
    }, [reload])

    const fetchTheCabs = async () => {
        try {
            const response = await adminAxios.get(adminApis.cabs)
            console.log(response)
            SetCabData(response.data)
        } catch (error) {
            handleErrors(error)
        }
    }




    const columns = [

        {
            name: 'Type',
            selector: (row: cab) => row.cabType,
        },
        {
            name: 'Price per KM',
            selector: (row: cab) => row.price,
        },
        {
            name: 'Max Persons',
            selector: (row: cab) => row.maxPersons,
        },
        {
            name: 'Available Drivers',
            selector: (row: cab) => row.drivers.length,
        },
        {
            name: 'Edit',
            cell: (row: cab) => (
                <h2 className="cursor-pointer"
                    onClick={() => { SetHandleCabEditModal(true), SetCabId(row._id) }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                        <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c0-21.9-21.9-21.9-79.2 0L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" fill="#0adb49" />
                    </svg>
                </h2>
            ),
        },

    ]

    const handleCabResult = async () => {
        SetAddCabModal(false)
        SetReload(!reload)
    }

    const handleCabEditResult = async () => {
        SetHandleCabEditModal(false)
        SetReload(!reload)
    }


    return (
        <>
            {addCabModal &&
                <Suspense >
                    <AddCabModal handleCabResult={handleCabResult} />
                </Suspense>

            }

            {handleCabEditModal &&
                <Suspense>
                    <EditCabModal handleCabEditResult={handleCabEditResult} cabId={cabId} />
                </Suspense>
            }

            <div className="mt-10 w-10/12 ms-32 bg-white p-6 rounded-3xl shadow-2xl justify-center">
                <p onClick={() => SetAddCabModal(true)}>Add New Cab</p>
                <Suspense>
                    {cabData &&
                        <DataTable
                            style={{ zIndex: '-1' }}
                            columns={columns}
                            data={cabData}
                            fixedHeader
                            highlightOnHover
                            pagination
                        />
                    }
                </Suspense>
            </div>
        </>
    )
}

export default ListAllCabs