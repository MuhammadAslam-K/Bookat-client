import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-hot-toast"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


import { auth } from "../../services/firebase/config"
import { useDispatch } from 'react-redux';
import { userLogin } from '../../services/redux/slices/userAuth';
import { driverLogin } from "../../services/redux/slices/driverAuth"
import { adminLogin } from "../../services/redux/slices/adminAuth"
import { loginComponentProps } from '../../interfaces/comman';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import { customLoadingStyle } from '../../Constraints/customizeLoaderStyle';
import userEndPoints from '../../Constraints/endPoints/userEndPoints';
import driverEndPoints from '../../Constraints/endPoints/driverEndPoints';
import adminEndPoint from '../../Constraints/endPoints/adminEndPoint';
import { handleErrors } from '../../Constraints/apiErrorHandling';


function Login(data: loginComponentProps) {

    const { loginserver, signup, person, resetpassword } = data
    const [showPassword, setShowPassword] = useState(false)
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
            const response = await userAxios.post(loginserver, values)
            if (person == "user") {
                dispatch(userLogin({ userId: response.data.userId, mobile: response.data.mobile }));
                localStorage.setItem('userToken', response.data.token);
                navigate(userEndPoints.home)
            }
            else if (person == "driver") {

                localStorage.setItem('driverToken', response.data.token);
                console.log(response)
                const { document, vehicle, driverId, vehicleType } = response.data
                console.log("doc", document, "vehickle", vehicle)
                dispatch(driverLogin({ document, vehicle, driverId, vehicleType }))

                console.log("Navigating to driver dashboard");
                navigate(driverEndPoints.dashboard);
            }
            else if (person == "admin") {
                dispatch(adminLogin())
                localStorage.setItem('adminToken', response.data);
                navigate(adminEndPoint.dashboard)
            }

        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    };



    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });

    const signIpWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const { displayName, email } = result.user;

            if (displayName && email) {
                submitSignInWithGoogle(displayName, email);
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };


    const submitSignInWithGoogle = async (displayName: string, email: string) => {
        try {
            const value = { displayName, email }
            const response = await userAxios.post(`/google${loginserver}`, value)
            localStorage.setItem('userToken', response.data.token);
            console.log("response :", response)
            dispatch(userLogin({ userId: response.data.userId, mobile: response.data.mobile }));
            // dispatch(setUserId(response.data.userId))

            if (person == "user") {
                navigate(userEndPoints.home)
            }

        } catch (error) {
            console.log(error)
            handleErrors(error)
        }
    }

    const handelPasswordResetLink = async () => {
        try {
            if (formik.values.email === "") {
                toast.error("please enter the Email")
            }
            else {

                toast.loading('Password Reset link is sending to your email please wait...', {
                    style: customLoadingStyle,
                });

                const data = { email: formik.values.email }
                const response = await userAxios.post(resetpassword, data)
                console.log(response)
                toast.dismiss()
                toast.success("link has been sended successfully")
            }
        } catch (error) {
            toast.dismiss()
            console.log(error)
            handleErrors(error)
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

                                <div className="flex justify-between">
                                    <div>
                                        <input
                                            type="checkbox"
                                            id="showPassword"
                                            onChange={() => setShowPassword(!showPassword)}
                                            className="mr-2"
                                        />
                                        <label htmlFor="showPassword">Show Password</label>
                                    </div>
                                    {person == "admin" ? "" :
                                        <p className='text-blue-600 cursor-pointer hover:cursor-pointer'
                                            onClick={handelPasswordResetLink}
                                        >forgot password ?</p>
                                    }
                                </div>

                                <button className="mt-3 w-full cursor-pointer rounded-lg bg-blue-600 pt-3 pb-3 text-white shadow-lg hover:bg-blue-400" type='submit'>
                                    Submit
                                </button>

                            </form>
                            {person == "admin" ? "" :
                                <>
                                    {person == "user" &&
                                        <>
                                            <div className="mt-1 flex items-center">
                                                <div className="w-full border-t border-gray-400"></div>
                                                <div className="mx-4 text-sm text-gray-600">or</div>
                                                <div className="w-full border-t border-gray-400"></div>
                                            </div>
                                            <button className="mt-2 w-full cursor-pointer rounded-lg border bg-red-600 pt-3 pb-3 text-white shadow-2xl hover:bg-red-400"
                                                onClick={signIpWithGoogle}
                                            >
                                                Sign in with Google
                                            </button>

                                        </>
                                    }
                                    <div className="flex item-center w-full text-center ms-20 my-5">
                                        <div className="">
                                            <h1 className='ms-5'>Demo User</h1>
                                            <p>Email : jazool@yopmail.com</p>
                                            <p>password : Muhammad2003</p>
                                        </div>
                                    </div>
                                    <div className="mt-1 text-center">
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