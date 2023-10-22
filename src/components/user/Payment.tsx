import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react"
import { ErrorResponse } from "./UserProfile";
import toast from "react-hot-toast";
import { userAxios } from "../../Constraints/axiosInterceptors/userAxiosInterceptors";
import userApis from "../../Constraints/apis/userApis";
import { rideDetails } from "./RideConfermation";

function Payment(props: { userId: string | null }) {

    const { userId } = props

    const [rideInfo, setRideInfo] = useState<rideDetails | null>(null);


    useEffect(() => {
        const fetchRideInfo = async () => {
            try {
                const response = await userAxios.post(userApis.getRideDetails, { userId })
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
    })
    return (
        <div>
            <div className="w-full max-w-sm rounded-xl bg-layer-2 px-8 py-6">
                <h3 className="text-lg font-semibold text-heading">Transfer Details</h3>

                <dl className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">You Sent</dt>
                        <dd className="text-lg font-semibold text-heading">$3,200 USD</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">
                            Total fees (included)
                        </dt>
                        <dd className="text-sm font-semibold text-heading">23.34 USD</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">
                            Total amount to convert
                        </dt>
                        <dd className="text-sm font-semibold text-heading">3,176.66 USD</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">
                            Guaranteed Rate (24 hours)
                        </dt>
                        <dd className="text-sm font-semibold text-heading">124.75 USD</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">Recipient gets</dt>
                        <dd className="text-lg font-semibold text-heading">¥377,244 JPY</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-sm font-semibold text-text">Arrives in</dt>
                        <dd className="text-sm font-semibold text-heading">5 min</dd>
                    </div>
                </dl>

                <div className="mt-6 flex flex-col space-y-2">
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-primary bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:border-primary-accent hover:bg-primary-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-primary disabled:hover:bg-primary disabled:hover:text-white dark:focus:ring-white/80"
                    >
                        Continue to payment
                    </button>
                    <button
                        type="button"
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl border-2 border-critical bg-critical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:border-critical-accent hover:bg-critical-accent focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:ring-offset-0 disabled:opacity-30 disabled:hover:border-critical disabled:hover:bg-critical disabled:hover:text-white dark:focus:ring-white/80"
                    >
                        Cancel this transfer
                    </button>
                </div>
            </div>
        </div>

    )
}

export default Payment