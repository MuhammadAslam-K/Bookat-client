import { useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from "yup"
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';

interface ErrorResponse {
    error: string;
}


function PasswordReset(data: { passwordResetServer: string, id: string | null, successNavigation: string }) {

    const { id, passwordResetServer, successNavigation } = data

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const without_error_class = "pl-2 outline-none border-b-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-b border-red-400 w-full rounded-lg p-2.5 sm:text-sm";


    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(8, "Minimum 8 Charecter required")
                .matches(/^(?=.*[A-Z])/, "Must include One uppercase letter")
                .matches(/^(?=.*\d)/, "Must include one digit")
                .required("Passowrd is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password")], "Password must match")
                .required("Please re-enter the password"),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });
    const handleSubmit = async (values: { password: string; confirmPassword: string; }) => {
        try {
            const data = {
                id: id,
                password: values.password
            };

            await userAxios.post(passwordResetServer, data);
            toast.success("Reset Password Successfully")
            navigate(successNavigation)

        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError: AxiosError<ErrorResponse> = error;
                if (axiosError.response) {
                    toast.error("link expired");
                } else {
                    toast.error('Network Error occurred.');
                }
            }
        }
    }

    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gray-100" >
                <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full ">
                        <div className="p-8">
                            <h1 className="text-2xl text-blue-600">Reset Password</h1>
                            <form className="mt-8" onSubmit={formik.handleSubmit}>

                                <div className='mb-6'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="password"
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
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        required
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.confirmPassword && formik.errors.confirmPassword
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                        <div className="text-red-500 text-xs">{formik.errors.confirmPassword}</div>
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
                                    <div className="flex justify-end">
                                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                        >Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PasswordReset


