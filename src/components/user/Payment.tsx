import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import { ErrorResponse } from "./UserProfile";
import toast from "react-hot-toast";
import { userAxios } from "../../Constraints/axiosInterceptors/userAxiosInterceptors";
import userApis from "../../Constraints/apis/userApis";
import { rideDetails } from "./rides/RideConfermation";
// import displayRazorpay from "../razorPay";
import { useNavigate } from "react-router-dom";
import userEndPoints from "../../Constraints/endPoints/userEndPoints";
// import Razorpay from "razorpay";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    key: string;
    currency: string;
    amount: number;
    name: string;
    prefill: {
        name: string;
    };
    handler?: (response: { razorpay_payment_id: unknown }) => void;
}


function Payment(props: { rideId: string | null }) {

    const { rideId } = props
    const navigate = useNavigate()

    const [rideInfo, setRideInfo] = useState<rideDetails | null>(null);
    const [modal, setModal] = useState(false)
    const [selectedRating, setSelectedRating] = useState(0);
    const [review, setReview] = useState('')


    useEffect(() => {
        const fetchRideInfo = async () => {
            try {
                const response = await userAxios.post(userApis.getRideDetails, { rideId })
                console.log("response ", response)
                setRideInfo(response.data)
            } catch (error) {
                console.log("handleConfirmOTP", error);
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response) {
                        toast.error(axiosError.response.data.error);
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchRideInfo()
    }, [rideId])

    const handlePayment = async () => {
        try {
            if (rideInfo) {
                const value = {
                    driverId: rideInfo?.driver_id,
                    rideId: rideId,
                    rating: selectedRating,
                    review,
                }
                const response = await userAxios.post(userApis.payment, value)
                console.log("response", response)
                const price = parseInt(rideInfo.price)
                const result = await DisplayRazorpay(500)
                console.log("resukt ;", result)
                navigate(userEndPoints.home)
            }
        } catch (error) {
            console.log("handleConfirmOTP", error);
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }


    const DisplayRazorpay = async (amount: number) => {

        // const navigate = useNavigate()

        const options: RazorpayOptions = {
            key: "rzp_test_G2uFOSlScJa8TV",
            currency: "INR",
            amount: amount * 100,
            name: "BOOKAT",
            prefill: {
                name: "BOOKAT",
            },
            handler: function (response: { razorpay_payment_id: unknown }) {
                if (response.razorpay_payment_id) {
                    console.log('Payment successful', response.razorpay_payment_id);
                    navigate(userEndPoints.home)
                } else {
                    console.log('Payment failed');
                }
            },
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const paymentPromise = new Promise((resolve, reject) => {
                const paymentObject = new window.Razorpay(options);
                paymentObject.open();
            });

            const paymentId = await paymentPromise;
            return paymentId;
        } catch (error) {
            console.log(error);
            return null;
        }
    };



    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gray-100" >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        {modal &&
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                                <div className="modal-content bg-white p-6 rounded-lg shadow-lg z-50">
                                    <h1 className='text-center font-semibold text-2xl'>Rating and Review</h1>
                                    <form className="flex flex-col items-center">
                                        <textarea
                                            className="w-72 h-24 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 resize-none"
                                            placeholder="Write your review..."
                                            onChange={(e) => setReview(e.target.value)}
                                        />

                                        <div className="ml-4 flex items-center space-x-2">
                                            {[...Array(5)].map((_, index) => (
                                                <svg
                                                    key={index}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="1em"
                                                    viewBox="0 0 576 512"
                                                    className={`h-6 my-4 w-6 fill-current cursor-pointer ${index + 1 <= selectedRating
                                                        ? 'text-yellow-500' // Apply the yellow color when selected
                                                        : 'text-gray-300'    // Apply the gray color when not selected
                                                        }`}
                                                    onClick={() => setSelectedRating(index + 1)}
                                                >
                                                    <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                                                </svg>
                                            ))}
                                        </div>


                                        <div className="flex flex-col">
                                            <button type='button' onClick={() => setModal(false)} className='w-full p-2 px-3 border border-slate-600 rounded-lg m-2'>Cancel Payment</button>
                                            <button type='button' onClick={handlePayment} className='p-2 w-full px-3 border border-slate-600 rounded-lg m-2'>Ignore</button>
                                            <button type='button' onClick={handlePayment} className='p-2 w-full px-3 border border-slate-600 rounded-lg m-2'>Submit</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        }
                        <div className="p-8">
                            <h3 className="text-lg font-semibold text-heading">Payment Details</h3>
                            {rideInfo &&
                                <dl className="mt-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-semibold text-text">Total Amount</dt>
                                        <dd className="text-lg font-semibold text-heading">₹ {rideInfo.price}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-semibold text-text">
                                            Distance
                                        </dt>
                                        <dd className="text-sm font-semibold text-heading">{rideInfo.distance}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-semibold text-text">
                                            From
                                        </dt>
                                        <dd className="text-sm font-semibold text-heading">{rideInfo.pickupLocation}</dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm font-semibold text-text">
                                            To
                                        </dt>
                                        <dd className="text-sm font-semibold text-heading">{rideInfo.dropoffLocation}</dd>
                                    </div>
                                </dl>
                            }
                            <div className="mt-6 flex flex-col space-y-2">
                                <button type="button"
                                    onClick={() => setModal(true)}
                                    className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">
                                    Pay now</button>

                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </>

    )
}

export default Payment