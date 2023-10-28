import { Modal, Ripple, initTE } from "tw-elements";
initTE({ Modal, Ripple });





function WalletHistory(props: { transactions: []; }) {

    const { transactions } = props

    function formatDate(dateString: string | number | Date) {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };
        const date = new Date(dateString);

        const formattedDate = date.toLocaleDateString('en-US', options);
        const formattedTime = date.toLocaleTimeString('en-US');

        return `${formattedDate} ${formattedTime}`;
    }

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
                                                Date
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Amount
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                Details
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {transactions.map((items: { date: string; amount: string; status: string; details: string }) => (


                                            <tr className=" bg-gray-700 dark:bg-slate-400 border-b  dark:border-gray-900  dark:hover:bg-gray-500">
                                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                    {formatDate(items.date)}
                                                </th>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.amount}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.status}
                                                </td>
                                                <td className="px-6 py-4 dark:text-white">
                                                    {items.details}
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

export default WalletHistory