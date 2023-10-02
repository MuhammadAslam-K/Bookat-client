import { useState } from 'react'
import { useFormik } from "formik"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { toast } from "react-hot-toast"
import axios, { AxiosError } from 'axios';
import { useNavigate, Link } from "react-router-dom"


import { auth } from "../../services/firebase"
import { basicSchema } from "../../utils/schema"
import { authServer } from "../../services/axios"
import { userSignUp } from '../../utils/interfaces';

function SignUp() {

    const [showPassword, setShowPassword] = useState(false)
    const provider = new GoogleAuthProvider()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            userName: "",
            email: "",
            mobile: "",
            password: "",
            re_password: "",
        },
        validationSchema: basicSchema,
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });

    const handleSubmit = async (values: userSignUp) => {
        try {
            await authServer.post("/signup", values)
            navigate('/login')

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<string> = error;
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
            await authServer.post("/google/signup", value)
            navigate('/login')

        } catch (error) {

            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<string> = error;
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
            <div className="flex h-screen items-center justify-center bg-gray-100" >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue">Sign up</h1>
                            <form className="mt-8" onSubmit={formik.handleSubmit}>

                                <div className='mb-6'>
                                    <input
                                        type="text"
                                        name="userName"
                                        placeholder="Username"
                                        required
                                        value={formik.values.userName}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.userName && formik.errors.userName
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.userName && formik.errors.userName && (
                                        <div className="text-red-500 text-xs">{formik.errors.userName}</div>
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
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">Already have an account? <Link to={"/login"} className="font-bold text-blue-600 no-underline hover:text-blue-400">Sign in</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

        </>
    )
}

export default SignUp