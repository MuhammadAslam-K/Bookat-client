import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom"
import axios, { AxiosError } from 'axios';
import { toast } from "react-hot-toast"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


import { authServer } from "../../../services/axios"
import { auth } from "../../../services/firebase/config"
import { useDispatch } from 'react-redux';
import { userLogin } from '../../../services/redux/slices/userAuth';
import { driverLogin } from "../../../services/redux/slices/driverAuth"
import { adminLogin } from "../../../services/redux/slices/adminAuth"
import { loginComponentProps } from '../../../utils/interfaces';

interface ErrorResponse {
    error: string;
}


function Login(data: loginComponentProps) {

    const { loginsucess, loginserver, signup, person } = data
    const [showPassword, setShowPassword] = useState(false)
    const provider = new GoogleAuthProvider()
    const navigate = useNavigate()
    const dispatch = useDispatch();


    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Please Enter a valid Email")
                .required("Please Enter value"),
            password: Yup.string()
                .required("Passowrd is required"),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });

    const handleSubmit = async (values: { email: string, password: string }) => {
        try {
            const response = await authServer.post(loginserver, values)
            if (person == "user") {
                dispatch(userLogin());
                localStorage.setItem('userToken', response.data);
            }
            else if (person == "driver") {
                dispatch(driverLogin())
                localStorage.setItem('driverToken', response.data);
            }
            else if (person == "admin") {
                dispatch(adminLogin())
                localStorage.setItem('adminToken', response.data);
            }

            navigate(loginsucess)

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


    const signIpWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const { displayName, email } = result.user;

                if (displayName && email) {
                    submitSignInWithGoogle(displayName, email)
                }

            }).catch((error) => {
                toast.error((error as Error).message);
            });
    }

    const submitSignInWithGoogle = async (displayName: string, email: string) => {
        try {
            const value = { displayName, email }
            const response = await authServer.post(`/google${loginserver}`, value)
            localStorage.setItem('userToken', response.data);
            dispatch(userLogin());

            navigate(loginsucess)

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

    const without_error_class = "pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-b border-red-400 w-full rounded-lg p-2.5 sm:text-sm";

    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gray-100" >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <h1 className="text-3xl font-black text-blue">Sign In</h1>
                            <form className="mt-8" onSubmit={formik.handleSubmit}>

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
                            {person == "admin" ? "" :
                                <>
                                    {person == "user" &&
                                        <>
                                            <div className="mt-4 flex items-center">
                                                <div className="w-full border-t border-gray-400"></div>
                                                <div className="mx-4 text-sm text-gray-600">or</div>
                                                <div className="w-full border-t border-gray-400"></div>
                                            </div><button className="mt-4 w-full cursor-pointer rounded-lg bg-red-600 pt-3 pb-3 text-white shadow-lg hover:bg-red-400"
                                                onClick={signIpWithGoogle}
                                            >
                                                Sign in with Google
                                            </button>
                                        </>
                                    }
                                    <div className="mt-4 text-center">
                                        <p className="text-sm text-gray-600">create an account? <Link to={signup} className="font-bold text-blue-600 no-underline hover:text-blue-400">Sign up</Link></p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Login