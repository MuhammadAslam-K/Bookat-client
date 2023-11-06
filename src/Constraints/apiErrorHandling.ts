

import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ErrorResponse {
    error: string;
}

export const handleErrors = (error: unknown) => {
    console.log(error)
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
