import { Suspense } from "react";
import DataTable from "react-data-table-component"
import { wallet } from "../../../interfaces/user";



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

    const columns = [

        {
            name: 'Date',
            selector: (row: wallet) => formatDate(row.date),
        },
        {
            name: 'Amount',
            selector: (row: wallet) => row.amount,
        },
        {
            name: 'Status',
            cell: (row: wallet) => (
                <p className={row.status === "Credited" ? 'text-green-600' : 'text-red-600'}>
                    {row.status}
                </p>
            ),
        },
        {
            name: 'Details',
            selector: (row: wallet) => row.details,
        },
    ]

    return (
        <div className="mt-10 w-10/12 lg:ms-32 ms-6 bg-white p-6 rounded-3xl shadow-2xl justify-center">
            <Suspense>
                <DataTable
                    style={{ zIndex: '-1' }}
                    columns={columns}
                    data={transactions}
                    fixedHeader
                    highlightOnHover
                    pagination
                />
            </Suspense>
        </div>
    );
}

export default WalletHistory