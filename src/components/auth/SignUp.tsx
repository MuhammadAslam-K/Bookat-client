import React, { useState, Suspense } from 'react'
import { useFormik } from "formik"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-hot-toast"
import { useNavigate, Link } from "react-router-dom"


import { auth } from "../../services/firebase/config"
import { basicSchema } from "../../utils/schema"
import { userSignUp } from '../../interfaces/user';
import { signupComponentProps } from '../../interfaces/comman';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../Constraints/apis/userApis';
import { handleErrors } from '../../Constraints/apiErrorHandling';
const Otp = React.lazy(() => import('./Otp'));


function SignUp(data: signupComponentProps) {

    const { login, signupSuccess, signupServer, person, checkExists } = data
    const [showPassword, setShowPassword] = useState(false)
    const [otp, setOtp] = useState(false)


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

    const submitSignUpForm = async () => {
        try {
            await userAxios.post(signupServer, formik.values)
            navigate(signupSuccess)
        } catch (error) {
            toast.error((error as Error).message)
        }
    }


    const handleSubmit = async (values: userSignUp) => {
        try {
            const data = { email: values.email, mobile: values.mobile }
            await userAxios.post(checkExists, data)
            const mobile = {
                mobile: values.mobile
            }
            await userAxios.post(userApis.sendOtp, mobile)
            setOtp(true)

        } catch (error) {
            console.log(error);
            handleErrors(error)
        }
    };


    const submitSignUpWithGoogle = async (displayName: string, email: string) => {
        try {
            const value = { displayName, email }
            await userAxios.post(`/google${signupServer}`, value)
            navigate(signupSuccess)

        } catch (error) {
            console.log(error);
            handleErrors(error)
        }
    }

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    const signUpWithGoogle = () => {

        signInWithPopup(auth, provider)
            .then((result) => {
                const { displayName, email } = result.user;

                if (displayName && email) {
                    submitSignUpWithGoogle(displayName, email);
                }

            }).catch((error) => {
                toast.error((error as Error).message);
            });
    }



    const without_error_class = "pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-b border-red-400 w-full rounded-lg p-2.5 sm:text-sm";

    return (
        <>

            {otp &&
                <div className='absolute z-50 flex justify-center items-center w-full h-full'>

                    <div className="modal w-1/4 h-1/3">
                        <div className="modal-content">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Otp mobile={formik.values.mobile} submitSignUpForm={submitSignUpForm} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            }

            <div className={`flex h-screen items-center justify-center  ${otp ? "bg-black opacity-60" : "bg-gray-100"}`} >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-gray-100 shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue mb-3">Sign up</h1>
                            <form className="" onSubmit={formik.handleSubmit}>

                                <div className='mb-4'>
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

                                <div className='mb-4'>
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

                                <div className='mb-4'>
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

                                <div className='mb-4'>
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

                                <div className='mb-4'>
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

                                <div className='mb-4'>
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


                                <button className=" w-full cursor-pointer rounded-lg bg-blue-600 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400" type='submit'>
                                    Submit
                                </button>

                            </form>
                            {person == "user" &&
                                <>
                                    <div className="mt-1 flex items-center">
                                        <div className="w-full border-t border-gray-400"></div>
                                        <div className="mx-4 text-sm text-gray-600">or</div>
                                        <div className="w-full border-t border-gray-400"></div>
                                    </div>

                                    <button className="mt-2 w-full cursor-pointer rounded-lg bg-red-600 pt-3 pb-3 text-white shadow-lg hover:bg-red-400"
                                        onClick={signUpWithGoogle}
                                    >
                                        Sign up with Google
                                    </button>

                                </>
                            }
                            <div className="flex item-center w-full text-center my-5">
                                <div className="">
                                    <p>The Twilio account is for trial so please use the demo user credentials provided in Sign in page.</p>
                                </div>
                            </div>
                            <div className="mt-2 text-center">
                                <p className="text-sm text-gray-600">Already have an account? <Link to={login} className="font-bold text-blue-600 no-underline hover:text-blue-400">Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default SignUp