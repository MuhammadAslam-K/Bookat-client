import { useState } from 'react'
import { useFormik } from "formik"
import { signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, Auth, signInWithPhoneNumber } from "firebase/auth";
import { toast } from "react-hot-toast"
import axios, { AxiosError } from 'axios';
import { useNavigate, Link } from "react-router-dom"



import { auth } from "../../../services/firebase/config"
import { basicSchema } from "../../../utils/schema"
import { authServer } from "../../../services/axios"
import { userSignUp } from '../../../utils/interfaces';
import { signupComponentProps } from '../../../utils/interfaces';

interface ErrorResponse {
    error: string; // Define the structure of your error response here
}

function SignUp(data: signupComponentProps) {

    const { login, signupSuccess, signupServer, person } = data
    const [showPassword, setShowPassword] = useState(false)
    // const [otpPage, setOtpPage] = useState(false)
    // const [OTP, setOTP] = useState("")
    const provider = new GoogleAuthProvider()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile: "",
            refrelCode: "",
            password: "",
            re_password: "",
        },
        validationSchema: basicSchema,
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });

    // interface ExtendedWindow extends Window {
    //     recaptchaVerifier?: firebase.auth.RecaptchaVerifier;
    //     confirmationResult?: firebase.auth.ConfirmationResult;
    // }
    // const extendedWindow = window as ExtendedWindow;


    // const onCaptchaVerify = () => {
    //     try {
    //         if (extendedWindow.recaptchaVerifier) {
    //             console.log("called onCaptchaVerify")
    //             extendedWindow.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    //                 size: "normal",
    //                 callback: () => {
    //                     console.log(73)
    //                     sendOTP()
    //                     toast.success("Otp sent successfully");
    //                 },
    //                 "expired-callback": () => {
    //                     toast.error("TimeOut");
    //                 },
    //             });
    //         }
    //         else {
    //             console.log("called else");
    //         }
    //     } catch (error) {
    //         console.log('error in onCaptchaVerify', error)
    //     }
    // };

    // const sendOTP = () => {
    //     console.log("called sendOTP");
    //     const appVerifier = extendedWindow.recaptchaVerifier;
    //     const number = "+91" + formik.values.mobile;

    //     signInWithPhoneNumber(auth, number, appVerifier)
    //         .then((confirmationResult) => {
    //             // SMS sent. Prompt user to type the code from the message, then sign the
    //             // user in with confirmationResult.confirm(code).
    //             extendedWindow.confirmationResult = confirmationResult;
    //             // ...
    //         }).catch((error) => {
    //             console.log(error)
    //         });
    // }

    // const VerifyOTP = () => {
    //     console.log("OTP", OTP)
    //     extendedWindow.confirmationResult.confirm(OTP).then((result) => {
    //         // User signed in successfully.
    //         const user = result.user;
    //         console.log(user)
    //         // ...
    //     }).catch((error) => {
    //         console.log(error);

    //         // User couldn't sign in (bad verification code?)
    //         // ...
    //     });
    // }





    const handleSubmit = async (values: userSignUp) => {
        try {
            // handleSendOTP()
            // setOtpPage(true)
            console.log("called handleSubmit");
            // onCaptchaVerify()

            await authServer.post(signupServer, values)
            navigate(signupSuccess)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error(axiosError.response.data.error);
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    };

    const submitSignUpWithGoogle = async (displayName: string, email: string) => {
        try {
            const value = { displayName, email }
            await authServer.post(`/google${signupServer}`, value)
            navigate(signupSuccess)

        } catch (error) {

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

    const signUpWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const { displayName, email } = result.user;

                if (displayName && email) {
                    submitSignUpWithGoogle(displayName, email)
                }

            }).catch((error) => {
                toast.error((error as Error).message);
            });
    }


    const without_error_class = "pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-b border-red-400 w-full rounded-lg p-2.5 sm:text-sm";

    return (
        <>
            {/* OTP
            {otpPage ?
                <div className="flex h-screen items-center justify-center bg-gray-100" >
                    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                        <div className="w-full ">
                            <div className="p-8 text-center">
                                <h2 className="text-2xl font-semibold mb-2">Mobile Verification</h2>
                                <p className="text-sm text-gray-400 mb-6">We have sent a code to your Mobile No</p>

                                <form className="space-y-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <input type="text"
                                            value={OTP}
                                            onChange={(e) => setOTP(e.target.value)}
                                        />
                                    </div>

                                    <button className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-600 focus:ring-1 focus:ring-blue-700 focus:outline-none"
                                        type='submit'
                                        onClick={VerifyOTP}
                                    >
                                        Verify Account
                                    </button>

                                    <div className="text-center text-sm text-gray-500">
                                        <p>Didn't receive the code? <a className="text-blue-600 hover:underline" href="http://" target="_blank" rel="noopener noreferrer">Resend</a></p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                : */}
            {/* // SIGN UP */}
            <div className="flex h-screen items-center justify-center bg-gray-100" >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue">Sign up</h1>
                            <form className="mt-8" onSubmit={formik.handleSubmit}>

                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="name"
                                        required
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.name && formik.errors.name
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.name && formik.errors.name && (
                                        <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        required
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.email && formik.errors.email
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        name="mobile"
                                        placeholder='Mobile No'
                                        required
                                        value={formik.values.mobile}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.mobile && formik.errors.mobile
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.mobile && formik.errors.mobile && (
                                        <div className="text-red-500 text-xs">{formik.errors.mobile}</div>
                                    )}

                                </div>

                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        name="refrelCode"
                                        placeholder="Refrel code (optional)"
                                        value={formik.values.refrelCode}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.refrelCode && formik.errors.refrelCode
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                </div>

                                <div className='mb-6'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        required
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.password && formik.errors.password
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="text-red-500 text-xs">{formik.errors.password}</div>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="re_password"
                                        placeholder="Password"
                                        required
                                        value={formik.values.re_password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.re_password && formik.errors.re_password
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.re_password && formik.errors.re_password && (
                                        <div className="text-red-500 text-xs">{formik.errors.re_password}</div>
                                    )}
                                </div>

                                <div className="mb-4 flex items-center">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        onChange={() => setShowPassword(!showPassword)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="showPassword">Show Password</label>
                                </div>


                                <button className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400" type='submit'>
                                    Submit
                                </button>

                            </form>
                            {person == "user" &&
                                <>
                                    <div className="mt-4 flex items-center">
                                        <div className="w-full border-t border-gray-400"></div>
                                        <div className="mx-4 text-sm text-gray-600">or</div>
                                        <div className="w-full border-t border-gray-400"></div>
                                    </div>

                                    <button className="mt-4 w-full cursor-pointer rounded-lg bg-red-600 pt-3 pb-3 text-white shadow-lg hover:bg-red-400"
                                        onClick={signUpWithGoogle}
                                    >
                                        Sign up with Google
                                    </button>
                                </>
                            }
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">Already have an account? <Link to={login} className="font-bold text-blue-600 no-underline hover:text-blue-400">Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    {/* Other JSX elements */}
                    <div id="recaptcha-container"></div>
                </div>
            </div>
            {/* } */}
        </>
    )
}

export default SignUp