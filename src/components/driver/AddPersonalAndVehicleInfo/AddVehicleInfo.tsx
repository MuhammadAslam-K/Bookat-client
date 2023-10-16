import { useFormik } from 'formik';
import * as Yup from "yup"
import React, { useEffect, useState } from 'react'
import { uploadImageToStorage } from '../../../services/firebase/storage';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { setVehicle } from '../../../services/redux/slices/driverAuth';
import axios, { AxiosError } from 'axios';
import { rootState } from '../../../utils/interfaces';
import { driverAxios } from '../../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import driverApis from '../../../Constraints/apis/driverApis';
import { customLoadingStyle } from '../../../Constraints/customizeLoaderStyle';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';


interface ErrorResponse {
    error: string;
}

function AddVehicleInfo() {
    const documentValue = useSelector((state: rootState) => state.driver.document);
    const vehicleValue = useSelector((state: rootState) => state.driver.vehicle);
    const dispatch = useDispatch();


    const navigate = useNavigate()

    const [rcImage, setrcImage] = useState<string | null>(null);
    const [rcImageName, setRcImageName] = useState<string | null>(null);

    const [vehicleImage1, setVehicleImage1] = useState<string | null>(null);
    const [vehicleImageName1, setVehicleImageName1] = useState<string | null>(null);

    const [vehicleImage2, setVehicleImage2] = useState<string | null>(null);
    const [vehicleImageName2, setVehicleImageName2] = useState<string | null>(null);

    const without_error_class = "pl-2 outline-none border-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-2 border-red-400 w-full rounded-lg p-2.5 sm:text-sm  placeholder:text-red-500";


    useEffect(() => {

        if (!documentValue) {
            navigate(driverEndPoints.addPersonalInfo)
        }

        if (vehicleValue) {
            navigate(driverEndPoints.dashboard)
        }
    }, [documentValue, navigate, vehicleValue])



    const handleRcImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setrcImage(reader.result as string);
                setRcImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setrcImage(null);
            setRcImageName(null);
        }
    };

    const handleVehicleImage1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVehicleImage1(reader.result as string);
                setVehicleImageName1(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setVehicleImage1(null);
            setVehicleImageName1(null);
        }
    };

    const handleVehicleImage2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setVehicleImage2(reader.result as string);
                setVehicleImageName2(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setVehicleImage2(null);
            setVehicleImageName2(null);
        }
    };

    const formik = useFormik({
        initialValues: {
            registrationId: "",
            vehicleModel: "",
            maxPersons: "",
            vehicleType: "",
        },
        validationSchema: Yup.object({
            registrationId: Yup.string()
                .matches(/^([A-Z]{2} \d{2} [A-Z]{1,2} \d{4})$/, "Please Enter a valid Vehicle Registration Number")
                .required("Please Enter value"),
            vehicleModel: Yup.string()
                .matches(/^[a-zA-Z]{3,20}$/, "Please enter a valid Model")
                .required("Please Enter value"),
            maxPersons: Yup.string()
                .matches(/^[1-7]$/, "Please enter a valid Input")
                .required("Please Enter value"),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });
    const handleSubmit = async (values: { registrationId: string; vehicleModel: string; maxPersons: string; }) => {
        try {
            if (rcImage && vehicleImage1 && vehicleImage2) {
                try {

                    toast.loading('Submitting the form please wait...', {
                        style: customLoadingStyle,
                    });

                    const rcImageUrl = await uploadImageToStorage(rcImage, rcImageName, "vehicle", "rc")
                    const vehicleImageUrl1 = await uploadImageToStorage(vehicleImage1, vehicleImageName1, "vehicle", "vehicleImage1")
                    const vehicleImageUrl2 = await uploadImageToStorage(vehicleImage2, vehicleImageName2, "vehicle", "vehicleImage2")

                    const formData = {
                        ...values,
                        rcImageUrl,
                        vehicleImageUrl1,
                        vehicleImageUrl2,
                    };


                    await driverAxios.post(driverApis.addVehicleInfo, formData);
                    dispatch(setVehicle())
                    toast.dismiss()
                    toast.success("Submitted the form successfully")
                    navigate(driverEndPoints.dashboard)

                } catch (error) {
                    console.log(error)
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

        } catch (error) {
            toast.error((error as Error).message)
            console.error("Error uploading image:", error);
        }
    }

    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gray-100 " >
                <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full">
                        <h1 className="text-3xl text-center font-black text-blue mt-6">Vehicle Info</h1>
                        <div className="p-8">
                            <form className="mt-8" onSubmit={formik.handleSubmit}>
                                <div className='mb-6 flex space-x-20'>
                                    <input
                                        type="text"
                                        name="registrationId"
                                        placeholder="Registration No"
                                        required
                                        value={formik.values.registrationId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.registrationId && formik.errors.registrationId
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />

                                    <div className="pl-2 flex outline-none border-4 w-full rounded-lg p-2.5 sm:text-sm">
                                        <div className="flex">
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-radio"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="mini"
                                                    checked={formik.values.vehicleType === "mini"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">Mini</label>
                                            </div>
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-2-radio"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="SUV"
                                                    checked={formik.values.vehicleType === "SUV"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-wtext-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">SUV</label>
                                            </div>
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-2-radio"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="Prime"
                                                    checked={formik.values.vehicleType === "Prime"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-wtext-gray-700 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">Prime</label>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                                <div className='mt-0'>
                                    {formik.touched.registrationId && formik.errors.registrationId && (
                                        <div className="text-red-500 text-xs mt-0">{formik.errors.registrationId}</div>
                                    )}
                                </div>

                                <div className='mb-6 flex space-x-20'>
                                    <label className="w-96 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">

                                        {rcImage ?
                                            <img src={typeof rcImage === 'string' ? rcImage : URL.createObjectURL(rcImage)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">Registration Certificate Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="rcImage"
                                            placeholder="RC Image"
                                            required
                                            className='hidden'
                                            onChange={handleRcImageChange}
                                        />

                                    </label>
                                    <div className='mb-6 space-y-3'>
                                        <input
                                            type="text"
                                            name="vehicleModel"
                                            placeholder={(formik.touched.vehicleModel && formik.errors.vehicleModel) ? formik.errors.vehicleModel : "Vehicle Model"}
                                            required
                                            value={formik.values.vehicleModel}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={
                                                formik.touched.vehicleModel && formik.errors.vehicleModel
                                                    ? with_error_class
                                                    : without_error_class
                                            }
                                        />

                                        <input
                                            type="text"
                                            name="maxPersons"
                                            placeholder={(formik.touched.maxPersons && formik.errors.maxPersons) ? formik.errors.maxPersons : "Max Persons"}
                                            required
                                            value={formik.values.maxPersons}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={
                                                formik.touched.maxPersons && formik.errors.maxPersons
                                                    ? with_error_class
                                                    : without_error_class
                                            }
                                        />
                                    </div>
                                </div>

                                <div className='mb-6 flex space-x-20'>
                                    <label className="w-3/4 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">

                                        {vehicleImage1 ?
                                            <img src={typeof vehicleImage1 === 'string' ? vehicleImage1 : URL.createObjectURL(vehicleImage1)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">Vehicle Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="vehicleImage1"
                                            placeholder="Aadhar Image"
                                            required
                                            className='hidden'
                                            onChange={handleVehicleImage1Change}
                                        />
                                    </label>


                                    <label className="w-3/4 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                        {vehicleImage2 ?
                                            <img src={typeof vehicleImage2 === 'string' ? vehicleImage2 : URL.createObjectURL(vehicleImage2)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">Vehicle Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="vehicleImage2"
                                            placeholder="License Image"
                                            required
                                            className='hidden'
                                            onChange={handleVehicleImage2Change}
                                        />
                                    </label>
                                </div>



                                <div className="flex justify-end">
                                    <button type="submit"
                                        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >Submit</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddVehicleInfo