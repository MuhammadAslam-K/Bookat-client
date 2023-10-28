// import axios, { AxiosError } from "axios";
// import { ErrorResponse } from "../components/admin/DataTable";
// import toast from "react-hot-toast";

// export const handleErrors = (error: AxiosError<ErrorResponse>) => {
//     if (axios.isAxiosError(error)) {
//         const axiosError: AxiosError<ErrorResponse> = error;
//         if (axiosError.response?.data.error == 'jwt expired') {
//             toast.error('Session Expired. Please Login Again.');

//         }
//         else if (axiosError.response?.data) {
//             toast.error(axiosError.response.data.error);
//         }
//         else {
//             toast.error('Network Error occurred.');
//         }
//     }
// }

import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../components/admin/DataTable';
import toast from 'react-hot-toast';

export const handleErrors = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response?.data.error === 'jwt expired') {
            toast.error('Session Expired. Please Login Again.');
        } else if (axiosError.response?.data) {
            toast.error(axiosError.response.data.error);
        } else {
            toast.error('Network Error occurred.');
        }
    }
};
