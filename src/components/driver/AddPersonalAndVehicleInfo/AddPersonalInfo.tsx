import { useFormik } from 'formik';
import * as Yup from "yup"
import { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom"

import { uploadImageToStorage } from '../../../services/firebase/storage';
import { useDispatch } from 'react-redux';
import { driverLogin, setDocument } from '../../../services/redux/slices/driverAuth';
import driverApis from '../../../Constraints/apis/driverApis';
import { driverAxios } from '../../../Constraints/axiosInterceptors/driverAxiosInterceptors';
import { customLoadingStyle } from '../../../Constraints/customizeLoaderStyle';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';
import { handleErrors } from '../../../Constraints/apiErrorHandling';




function AddPersonalInfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const [aadharImage, setAadharImage] = useState<string | null>(null);
    const [aadharImageName, setAadharImageName] = useState<string | null>(null);

    const [licenseImage, setLicenseImage] = useState<string | null>(null);
    const [licenseImageName, setLicenseImageName] = useState<string | null>(null);

    const [driverImage, setDriverImage] = useState<string | null>(null);
    const [driverImageName, setDriverImageName] = useState<string | null>(null);

    const without_error_class = "pl-2 outline-none border-4 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-2 border-red-400 w-full rounded-lg p-2.5 sm:text-sm";



    const handleAadharImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAadharImage(reader.result as string);
                setAadharImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setAadharImage(null);
            setAadharImageName(null);
        }
    };

    const handleLicenseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLicenseImage(reader.result as string);
                setLicenseImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setLicenseImage(null);
            setLicenseImageName(null);
        }
    };

    const handleDriverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setDriverImage(reader.result as string);
                setDriverImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setDriverImage(null);
            setDriverImageName(null);
        }
    };

    const formik = useFormik({
        initialValues: {
            aadharId: "",
            drivingLicenseId: "",
            address: "",
        },
        validationSchema: Yup.object({
            aadharId: Yup.string()
                .matches(/^\d{12}$/, "Please Enter a valid Aadhar number")
                .required("Please Enter value"),
            drivingLicenseId: Yup.string()
                .matches(/^\d{16}$/, "Please Enter a valid Driving ID")
                .required("Please Enter value"),
            address: Yup.string()
                .min(20, "Type a valid Address")
                .required("Please Enter value"),
        }),
        onSubmit: (values) => {
            handleSubmit(values)
        },
    });

    const handleSubmit = async (values: { aadharId: string; drivingLicenseId: string; address: string; }) => {
        try {
            if (aadharImage && licenseImage && driverImage) {
                try {
                    toast.loading('Submitting the form please wait...', {
                        style: customLoadingStyle,
                    });

                    const aadharImageUrl = await uploadImageToStorage(aadharImage, aadharImageName, "driver", "aadhar")
                    const licenseImageUrl = await uploadImageToStorage(licenseImage, licenseImageName, "driver", "license")
                    const driverImageUrl = await uploadImageToStorage(driverImage, driverImageName, "driver", "driver")


                    const formData = {
                        ...values,
                        aadharImageUrl,
                        licenseImageUrl,
                        driverImageUrl
                    };

                    const response = await driverAxios.post(driverApis.addPersonalInfo, formData);
                    const document = response.data.driver.driverDocuments
                    const { vehicle, driverId, vehicleType } = response.data
                    console.log(response.data)
                    console.log("document", document, vehicle)
                    dispatch(setDocument())
                    dispatch(driverLogin({ document, vehicle, driverId, vehicleType }))
                    toast.dismiss()
                    toast.success("Form submitted successfully")
                    navigate(driverEndPoints.addVehicleInfo)

                } catch (error) {
                    console.log(error);
                    toast.dismiss()
                    handleErrors(error)
                }
            }

        } catch (error) {
            toast.error((error as Error).message)
            console.error("Error uploading image:", error);
        }
    };





    return (
        <>
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex justify-center">
                    <div className="w-full">
                        <h1 className="text-3xl text-center font-black text-blue mt-6">Personal Info</h1>
                        <div className="p-8">
                            <form className="mt-8" onSubmit={formik.handleSubmit}>
                                <div className="mb-6 flex flex-col sm:flex-row  sm:space-x-20">

                                    <input
                                        type="text"
                                        name="aadharId"
                                        placeholder="Aadhar ID"
                                        required
                                        value={formik.values.aadharId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.aadharId && formik.errors.aadharId
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />

                                    <input
                                        type="text"
                                        name="drivingLicenseId"
                                        placeholder="License ID"
                                        required
                                        value={formik.values.drivingLicenseId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.drivingLicenseId && formik.errors.drivingLicenseId
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    />

                                </div>

                                <div className='flex justify-between'>
                                    <div>
                                        {formik.touched.aadharId && formik.errors.aadharId && (
                                            <div className="text-red-500 text-xs">{formik.errors.aadharId}</div>
                                        )}
                                    </div>

                                    <div>
                                        {formik.touched.drivingLicenseId && formik.errors.drivingLicenseId && (
                                            <div className="text-red-500 text-xs">{formik.errors.drivingLicenseId}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="mb-6 flex flex-col sm:flex-row space-x-0 sm:space-x-20">
                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">

                                        {aadharImage ?
                                            <img src={typeof aadharImage === 'string' ? aadharImage : URL.createObjectURL(aadharImage)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">Aadhar Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="aadharImage"
                                            placeholder="Aadhar Image"
                                            required
                                            className='hidden'
                                            onChange={handleAadharImageChange}
                                        />
                                    </label>


                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                        {licenseImage ?
                                            <img src={typeof licenseImage === 'string' ? licenseImage : URL.createObjectURL(licenseImage)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">License Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="licenseImage"
                                            placeholder="License Image"
                                            required
                                            className='hidden'
                                            onChange={handleLicenseImageChange}
                                        />
                                    </label>
                                </div>

                                <div className="mb-6 flex flex-col sm:flex-row space-x-0 sm:space-x-20">
                                    <textarea
                                        id="textArea"
                                        name="address"
                                        placeholder="Address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={
                                            formik.touched.address && formik.errors.address
                                                ? with_error_class
                                                : without_error_class
                                        }
                                    ></textarea>

                                    <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">
                                        {driverImage ?
                                            <img src={typeof driverImage === 'string' ? driverImage : URL.createObjectURL(driverImage)} className="max-h-32 w-full object-cover mt-4" />
                                            :
                                            <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                            </svg><span className="mt-2 text-base leading-normal">Driver Image</span></>
                                        }
                                        <input
                                            type="file"
                                            name="driverImage"
                                            placeholder="Driver Image"
                                            required
                                            className='hidden'
                                            onChange={handleDriverImageChange}
                                        />
                                    </label>
                                </div>

                                <div>
                                    {formik.touched.address && formik.errors.address && (
                                        <div className="text-red-500 text-xs">{formik.errors.address}</div>
                                    )}
                                </div>
                                <div className="flex justify-end">
                                    <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
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

export default AddPersonalInfo
