import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../Constraints/apis/userApis';

interface OtpProps {
    mobile: string;
    submitSignUpForm: () => Promise<void>;
}

function Otp(props: OtpProps) {

    const { mobile, submitSignUpForm } = props;
    const [seconds, setSeconds] = useState(300);

    const initialSeconds = 300;


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formik = useFormik({
        initialValues: {
            otp: '',
        },
        validationSchema: Yup.object({
            otp: Yup.string()
                .length(6, "Please Enter a valid OTP")
                .required('Please Enter value'),
        }),
        onSubmit: (values) => {
            handleSubmit(values);
        },
    });

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(prevSeconds => prevSeconds - 1);
            }
        }, 1000);

        if (seconds === 0) {
            clearInterval(countdownInterval);
        }

        return () => {
            clearInterval(countdownInterval);
        };
    }, [seconds]);


    const resendOTP = async () => {
        try {
            setSeconds(initialSeconds);
            const phone = {
                mobile: mobile
            }
            await userAxios.post(userApis.sendOtp, phone)

        } catch (error) {
            toast.error((error as Error).message);
        }
    }


    const handleSubmit = async (values: { otp: string }) => {
        try {

            const value = {
                otp: values.otp,
                mobile: mobile,
            };

            const response = await userAxios.post(userApis.verifyOtp, value);
            console.log("response", response);

            if (response.data.status == 401) {
                toast.error(response.data.message);
            } else {
                toast.success("OTP validated successfully");
                submitSignUpForm();
            }

        } catch (error) {
            console.log("error", error);
            toast.error((error as Error).message);
        }
    };


    const without_error_class = "pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-b border-red-400 w-full rounded-lg p-2.5 sm:text-sm";

    return (
        <>
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-500 shadow-2xl sm:flex justify-center">
                <div className="w-full ">
                    <div className="p-8">
                        <h1 className="text-2xl text-center text-gray-200">Enter OTP</h1>
                        <form onClick={formik.handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="Enter OTP"
                                    required
                                    value={formik.values.otp}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={
                                        formik.touched.otp && formik.errors.otp ? with_error_class : without_error_class
                                    }
                                />
                                {formik.touched.otp && formik.errors.otp && (
                                    <div className="text-red-500 text-xs">{formik.errors.otp}</div>
                                )}
                            </div>
                            <div className='flex justify-center'>
                                <button type="submit" className="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Submit</button>

                            </div>

                        </form>
                        {seconds > 0 ? (
                            <p className="text-center text-gray-200">
                                {minutes}:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}{' '}
                                minutes
                            </p>
                        ) : (
                            <button className="text-blue-500 hover:underline cursor-pointer"
                                onClick={resendOTP}
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Otp;
