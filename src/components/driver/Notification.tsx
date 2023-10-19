import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });


// interface ErrorResponse {
//     error: string;
// }


function Notification() {




    return (
        <>
            <div className="flex h-screen justify-center mt-9" >
                <div className="w-10/12 overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
                                <table className="w-full text-sm text-left text-white  dark:text-white">
                                    <thead className="text-xs text-white uppercase bg-gray-700 dark:bg-slate-500 dark:text-white border-b-white border-4 font-bold">

                                        <tr>
                                            <th scope="col" className="px-6 py-3">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                From
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                To
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Distance
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                Hourse
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                count down
                                            </th>

                                            <th scope="col" className="px-6 py-3">
                                                Action
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>


                                        <tr className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                200
                                            </th>
                                            <td className="px-6 py-4 dark:text-white">
                                                calicut
                                            </td>
                                            <td className="px-6 py-4 dark:text-white">
                                                Bengalore
                                            </td>
                                            <td className="px-6 py-4 dark:text-white">
                                                100km
                                            </td>

                                            <td className="px-6 py-4 dark:text-white" >
                                                1hr
                                            </td>
                                            <td className="px-6 py-4 dark:text-white">
                                                countdown
                                            </td>

                                            <td className="px-6 py-4 dark:text-white">
                                                <p>Approve</p>
                                                <p>Reject</p>
                                            </td>

                                        </tr>


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

export default Notification