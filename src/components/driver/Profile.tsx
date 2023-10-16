import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import * as Yup from "yup"
import axios, { AxiosError } from "axios"
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useFormik } from "formik";

import driverApis from "../../Constraints/apis/driverApis";
import { driverAxios } from "../../Constraints/axiosInterceptors/driverAxiosInterceptors";
import { driverLogout } from "../../services/redux/slices/driverAuth";
import { driverProfile } from "../../utils/interfaces";
import { customLoadingStyle } from "../../Constraints/customizeLoaderStyle";
import { uploadImageToStorage } from "../../services/firebase/storage";
import driverEndPoints from "../../Constraints/endPoints/driverEndPoints";


interface ErrorResponse {
    error: string;
}
function Profile() {

    const [readOnly, SetReadOnly] = useState(true)
    const [reload, Setreload] = useState(true)
    const [aadharImageName, setAadharImageName] = useState<string | null>(null);
    const [licenseImageName, setLicenseImageName] = useState<string | null>(null);
    const [driverImageName, setDriverImageName] = useState<string | null>(null);

    const without_error_class = "pl-2 border-b-4 w-full outline-none rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight";

    const dispatch = useDispatch();
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await driverAxios.get(driverApis.profie)

                const data: driverProfile = {
                    name: response.data.name,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    aadharId: response.data.aadhar.aadharId,
                    licenseId: response.data.license.licenseId,
                    aadharImageUrl: response.data.aadhar.aadharImage,
                    licenseImageUrl: response.data.license.licenseImage,
                    driverImageUrl: response.data.driverImageUrl,
                    vehicleVerified: response.data.vehicle.vehicleVerified,
                    driverVerified: response.data.driver.driverVerified,
                    refrel: response.data.refrel,
                    isAvailable: response.data.isAvailable,
                }
                console.log(data);

                formik.setValues(data);
            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response?.data) {
                        toast.error(axiosError.response.data.error);
                        dispatch(driverLogout())
                        navigate(driverEndPoints.login)

                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            }
        }
        fetchData()
    }, [reload])


    const handleDriverAvailable = async () => {
        try {

            await driverAxios.post(driverApis.available)
            Setreload(!reload)
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

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            mobile: "",
            aadharId: "",
            licenseId: "",
            refrel: "",
            aadharImageUrl: "",
            licenseImageUrl: "",
            driverImageUrl: "",
            vehicleVerified: "",
            driverVerified: "",
            isAvailable: false,
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, "Type a valid Name")
                .required("Please Enter the value"),
            email: Yup.string()
                .email("Please Enter a valid Email")
                .required("Please Enter value"),
            mobile: Yup.string()
                .length(10, "Please Enter a valid number")
                .required("Please Enter value"),
            aadharId: Yup.string()
                .matches(/^\d{12}$/, "Please Enter a valid Aadhar number")
                .required("Please Enter value"),
            licenseId: Yup.string()
                .matches(/^\d{16}$/, "Please Enter a valid Driving ID")
                .required("Please Enter value"),
        }),
        onSubmit: async (values, formikHelpers) => {
            try {
                toast.loading('Updating the Profile please wait...', {
                    style: customLoadingStyle,
                });

                if (aadharImageName && aadharImageName !== values.aadharImageUrl) {
                    console.log("aadhar before", values.aadharImageUrl)
                    const aadharImageUrl = await uploadImageToStorage(
                        values.aadharImageUrl,
                        aadharImageName,
                        'driver',
                        'aadhar'
                    );
                    formik.setFieldValue('aadharImageUrl', aadharImageUrl);
                }
                if (licenseImageName && licenseImageName !== values.licenseImageUrl) {
                    const licenseImageUrl = await uploadImageToStorage(
                        values.licenseImageUrl,
                        licenseImageName,
                        'driver',
                        'license'
                    );
                    formik.setFieldValue('licenseImageUrl', licenseImageUrl);
                }
                if (driverImageName && driverImageName !== values.driverImageUrl) {
                    const driverImageUrl = await uploadImageToStorage(
                        values.driverImageUrl,
                        driverImageName,
                        'driver',
                        'driver'
                    );
                    formik.setFieldValue('driverImageUrl', driverImageUrl);
                }

                await driverAxios.post(driverApis.updateProfile, values);
                toast.dismiss();
                SetReadOnly(!readOnly)
                toast.success("Updated profile successfully");
                Setreload(!reload)

            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const axiosError: AxiosError<ErrorResponse> = error;
                    if (axiosError.response) {
                        toast.error(axiosError.response.data.error);
                    } else {
                        toast.error('Network Error occurred.');
                    }
                }
            } finally {
                formikHelpers.setSubmitting(false);
            }
        }

    });


    // EDIT USER
    const handleAadharImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue("aadharImageUrl", reader.result as string);
                setAadharImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setAadharImageName(null);
        }
    };

    const handleLicenseImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('licenseImageUrl', reader.result as string);
                setLicenseImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setLicenseImageName(null);
        }
    };

    const handleDriverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('driverImageUrl', reader.result as string);
                setDriverImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setDriverImageName(null);
        }
    };


    return (
        <div className="flex justify-center" >
            {formik.values &&
                <div className="w-11/12 overflow-hidden rounded-3xl bg-white shadow-2xl mt-11 mb-11">
                    <div className="w-full">
                        <section className="bg-white ">
                            {/* SECTION ONE */}
                            <form className="relative lg:flex" onSubmit={formik.handleSubmit}>
                                <div className="min-h-screen mt-4 lg:w-1/3 flex flex-col text-center justify-center items-center">
                                    <div>
                                        <label
                                            htmlFor="driverImageInput"
                                        >
                                            <img
                                                className="object-cover object-center w-full lg:w-[20rem] rounded-lg"
                                                src={formik.values.driverImageUrl}
                                                alt=""
                                            />
                                        </label>
                                        <input
                                            id="driverImageInput"
                                            type="file"
                                            name="driverImageUrl"
                                            placeholder="driverImageUrl"
                                            className="hidden"
                                            onChange={handleDriverImageChange}
                                        />
                                    </div>

                                    <div className="w-full p-7 max-w-md overflow-hidden rounded-2xlshadow-2xl sm:flex justify-center">
                                        <div className="w-full ">
                                            <div className=" ms-7 flex space-x-5">
                                                <p className="mt-2">Account Status</p>
                                                {formik.values.vehicleVerified && formik.values.driverVerified ?
                                                    <div className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Verifyed</div> :
                                                    <div className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600  shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Not Verifyed</div>
                                                }

                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex">

                                        <Link to={driverEndPoints.vehicleInfo}>
                                            <p className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">vehicle Info</p>
                                        </Link>

                                        <label className="relative inline-flex items-center mb-6 ms-7 cursor-pointer" >
                                            <input
                                                type="checkbox"
                                                checked={formik.values.isAvailable}
                                                className="sr-only peer"
                                                onChange={handleDriverAvailable}
                                            />
                                            <div className={`w-11 h-6 bg-gray-200 ${formik.values.isAvailable ? 'bg-green-600' : 'bg-gray-200'} peer-focus:outline-none peer-focus:ring-4  rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600`}></div>
                                            <span className="ml-3 font-medium text-gray-900 dark:text-gray-600">Available</span>
                                        </label>


                                    </div>
                                </div>
                                {/* SECTION TWO */}
                                <div className="hidden w-3/4 min-h-screen bg-gray-200 lg:block">

                                    <h1 className="text-2xl my-5 items-center font-semibold flex flex-col text-center justify-center text-gray-800 capitalize lg:text-3xl dark:text-black">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="name"
                                            readOnly={readOnly}
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="text-blue-500 bg-gray-200 outline-none"
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                        )}
                                    </h1>


                                    <div className=" lg:flex lg:items-center  ms-7">

                                        <div className="p-8 me-5 bg-white rounded-2xl w-full">

                                            <div>
                                                {readOnly ? (
                                                    <div onClick={() => SetReadOnly(!readOnly)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg>
                                                    </div>
                                                ) : (
                                                    <div className="flex">
                                                        <button
                                                            type="submit"
                                                            className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                                        >
                                                            Save
                                                        </button>
                                                        <button type="button" onClick={() => SetReadOnly(!readOnly)}
                                                            className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                                            cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>


                                            <div className="flex space-x-20 mx-3 mb-6">

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Email
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="email"
                                                        placeholder="email"
                                                        readOnly={readOnly}
                                                        value={formik.values.email}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={without_error_class}
                                                    />


                                                    {formik.touched.email && formik.errors.email && (
                                                        <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                                    )}

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Mobile
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="mobile"
                                                        placeholder="mobile"
                                                        readOnly={readOnly}
                                                        value={formik.values.mobile}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={without_error_class}
                                                    />

                                                    {formik.touched.mobile && formik.errors.mobile && (
                                                        <div className="text-red-500 text-xs">{formik.errors.mobile}</div>
                                                    )}

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Refrel
                                                    </label>
                                                    <p className="pl-2  border-b-4 w-full rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight focus:outline-none focus:bg-white">
                                                        {formik.values.refrel}
                                                    </p>
                                                </div>

                                            </div>

                                            <div className="flex space-x-20 mx-3 mb-6">
                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Aadhar Id
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="aadharId"
                                                        placeholder="AadharId"
                                                        readOnly={readOnly}
                                                        value={formik.values.aadharId}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={without_error_class}
                                                    />

                                                    {formik.touched.aadharId && formik.errors.aadharId && (
                                                        <div className="text-red-500 text-xs">{formik.errors.aadharId}</div>
                                                    )}

                                                </div>

                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        license
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="licenseId"
                                                        placeholder="licenseId"
                                                        readOnly={readOnly}
                                                        value={formik.values.licenseId}
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        className={without_error_class}
                                                    />

                                                    {formik.touched.licenseId && formik.errors.licenseId && (
                                                        <div className="text-red-500 text-xs">{formik.errors.licenseId}</div>
                                                    )}

                                                </div>

                                            </div>
                                            <div className="flex space-x-20 mx-3 mb-6 ">
                                                <div className="w-full md:w-4/5 px-3 mb-6 md:mb-0">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        Aadhar Image
                                                        <img src={formik.values.aadharImageUrl} className="rounded-lg max-h-44" />
                                                        <input
                                                            type="file"
                                                            name="aadharImageUrl"
                                                            placeholder="Aadhar Image"
                                                            className='hidden'
                                                            onChange={handleAadharImageChange}
                                                        />
                                                    </label>
                                                </div>

                                                <div className="w-full md:w-4/5  px-3 mb-6 md:mb-0 ">
                                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                        license Image
                                                        <img src={formik.values.licenseImageUrl} className="rounded-lg max-h-44" />
                                                        <input
                                                            type="file"
                                                            name="licenseImageUrl"
                                                            placeholder="License Image"
                                                            className='hidden'
                                                            onChange={handleLicenseImageChange}
                                                        />
                                                    </label>
                                                </div>

                                            </div>

                                        </div>


                                    </div>

                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            }
        </div >
    )
}

export default Profile