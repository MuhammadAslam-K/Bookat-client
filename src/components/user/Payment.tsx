import { useEffect, useState } from "react"

import { userAxios } from "../../Constraints/axiosInterceptors/userAxiosInterceptors";
import userApis from "../../Constraints/apis/userApis";
import { rideDetails } from "./rides/CurrentRideInfo";
import { handleErrors } from "../../Constraints/apiErrorHandling";
import { useNavigate } from "react-router-dom";
import userEndPoints from "../../Constraints/endPoints/userEndPoints";
import queryString from "query-string";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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


    useEffect(() => {
        const fetchRideInfo = async () => {
            try {
                const response = await userAxios.patch(`${userApis.getRideDetails}?id=${rideId}`)
                console.log("response ", response)
                setRideInfo(response.data)
            } catch (error) {
                console.log(error);
                handleErrors(error)
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
                    price: rideInfo.price
                }
                await userAxios.post(userApis.payment, value)
                const price = parseInt(rideInfo.price)
                await DisplayRazorpay(price)
            }
        } catch (error) {
            console.log(error);
            handleErrors(error)
        }
    }


    const DisplayRazorpay = async (amount: number) => {

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

                    const queryParams = rideId ? { rideId } : {};
                    const queryStringData = queryString.stringify(queryParams);
                    navigate(`${userEndPoints.review}?${queryStringData}`);

                } else {
                    console.log('Payment failed');
                }
            },
        };

        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const paymentPromise = new Promise(() => {
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
                        {/* {modal &&
                            <div className="fixed inset-0 flex items-center justify-center z-50">
                                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                                <div className="modal-content w-2/6 p-6 rounded-lg shadow-lg z-50">
                                    {rideId &&
                                        <RatingReviewForm id={rideId} handleRatingAndReviewModal={handleRatingAndReviewModal} />
                                    }
                                </div>
                            </div>
                        } */}
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
                                    onClick={() => handlePayment()}
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