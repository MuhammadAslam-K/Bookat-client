
import React, { useEffect, useState } from 'react';
import { adminAxios } from '../../Constraints/axiosInterceptors/adminAxiosInterceptors';
import adminApis from '../../Constraints/apis/adminApis';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../admin/DataTable';
import toast from 'react-hot-toast';

interface DataItem {
    id: number;
    name: string;
    email: string;
    // Add more properties as needed
}

const UserWallet: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [data, setData] = useState<DataItem[]>([]); // Use setData instead of SetData
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await adminAxios.get(adminApis.getuserData);
                console.log(response);

                const responseData: DataItem[] = response.data;
                setData(responseData); // Use setData here

            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;

                    if (axiosError.response?.data.error === "jwt expired") {
                        toast.error("Sorry, your login session has timed out. Kindly log in again");
                    }
                    if (axiosError.response) {
                        toast.error(axiosError.response.data.error);
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        };

        fetchData();
    }, []); // Empty dependency array ensures this effect runs once after initial render

    const filteredData = data.filter((item: DataItem) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto mt-8 p-4">
            <input
                type="text"
                placeholder="Search..."
                className="w-full p-2 mb-4 rounded"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2">ID</th>
                        <th className="py-2">Name</th>
                        {/* Add more table headers as needed */}
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item) => (
                        <tr key={item.id}>
                            <td className="py-2">{item.id}</td>
                            <td className="py-2">{item.name}</td>
                            <td className="py-2">{item.email}</td>
                            {/* Add more table cells as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        className={`mx-2 p-2 ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        onClick={() => setCurrentPage(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default UserWallet;
