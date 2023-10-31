import { useEffect, useState } from "react";
import { driverAxios } from "../../Constraints/axiosInterceptors/driverAxiosInterceptors";
import driverApis from "../../Constraints/apis/driverApis";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup"
import { customLoadingStyle } from "../../Constraints/customizeLoaderStyle";
import { uploadImageToStorage } from "../../services/firebase/storage";
import { handleErrors } from "../../Constraints/apiErrorHandling";


interface vehicleDocuments {
    registrationId: string,
    rcImageUrl: string,
    vehicleModel: string,
    maxPersons: string,
    vehicleType: string,
    vehicleImageUrl1: string,
    vehicleImageUrl2: string,
}

function VehicleInfo() {

    const [readOnly, SetReadOnly] = useState(true)
    const [reload, Setreload] = useState(true)
    const [rcImagesName, setRcImagesName] = useState<string | null>(null);
    const [vehicleImageName1, SetVehicleImageName1] = useState<string | null>(null);
    const [vehicleImageName2, setvehicleImageName2] = useState<string | null>(null);

    const without_error_class = "pl-2 border-b-4 w-full outline-none rounded-lg p-2.5 sm:text-sm appearance-none block  bg-gray-200 text-gray-700 border mb-3 leading-tight";


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await driverAxios.get(driverApis.vehicle)

                console.log(response)
                const responseData = response.data.vehicleDocuments

                const data: vehicleDocuments = {
                    registrationId: responseData.registration.registrationId,
                    rcImageUrl: responseData.registration.registrationImage,
                    vehicleModel: responseData.vehicleModel,
                    maxPersons: responseData.maxPersons,
                    vehicleType: responseData.vehicleType,
                    vehicleImageUrl1: responseData.vehicleImage1,
                    vehicleImageUrl2: responseData.vehicleImage2,
                }

                formik.setValues(data);
            } catch (error) {
                handleErrors(error)
            }
        }
        fetchData()
    }, [reload])


    const formik = useFormik({
        initialValues: {
            registrationId: "",
            rcImageUrl: "",
            vehicleModel: "",
            maxPersons: "",
            vehicleType: "",
            vehicleImageUrl1: "",
            vehicleImageUrl2: " ",

        },
        validationSchema: Yup.object({
            registrationId: Yup.string()
                .matches(/^([A-Z]{2} \d{2} [A-Z]{1,2} \d{4})$/, "Please Enter a valid Vehicle Registration Number")
                .required("Please Enter value"),
            vehicleModel: Yup.string()
                .matches(/^[a-zA-Z]{3,30}$/, "Please enter a valid Model")
                .required("Please Enter value"),
            maxPersons: Yup.string()
                .matches(/^[1-7]$/, "Please enter a valid Input")
                .required("Please Enter value"),
        }),
        onSubmit: async (values, formikHelpers) => {
            try {

                toast.loading('Updating the Vehicle info please wait...', {
                    style: customLoadingStyle,
                });

                if (rcImagesName && rcImagesName !== values.rcImageUrl) {
                    const rcImageUrl = await uploadImageToStorage(
                        values.rcImageUrl,
                        rcImagesName,
                        'vehicle',
                        'rc'
                    );
                    formik.setFieldValue('rcImageUrl', rcImageUrl);
                }
                if (vehicleImageName1 && vehicleImageName1 !== values.vehicleImageUrl1) {
                    const vehicleImageUrl1 = await uploadImageToStorage(
                        values.vehicleImageUrl1,
                        vehicleImageName1,
                        'vehicle',
                        'vehicleImageUrl1'
                    );
                    console.log("vehicle image", vehicleImageUrl1)
                    formik.setFieldValue('vehicleImageUrl1', vehicleImageUrl1);
                }
                if (vehicleImageName2 && vehicleImageName2 !== values.vehicleImageUrl2) {
                    const vehicleImageUrl2 = await uploadImageToStorage(
                        values.vehicleImageUrl2,
                        vehicleImageName2,
                        'driver',
                        'vehicleImageUrl2'
                    );
                    formik.setFieldValue('vehicleImageUrl2', vehicleImageUrl2);
                }

                console.log("values", values)
                await driverAxios.patch(driverApis.updateVehicle, values);
                toast.dismiss();
                SetReadOnly(!readOnly);
                toast.success("Updated profile successfully");
                Setreload(!reload)

            } catch (error) {
                handleErrors(error)
            } finally {
                formikHelpers.setSubmitting(false);
            }
        }

    });


    // EDIT USER
    const handleRcImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue("rcImageUrl", reader.result as string);
                setRcImagesName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setRcImagesName(null);
        }
    };

    const handlevehicleImageUrl1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('vehicleImageUrl1', reader.result as string);
                SetVehicleImageName1(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            SetVehicleImageName1(null);
        }
    };

    const handlevehicleImageUrl2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                formik.setFieldValue('vehicleImageUrl2', reader.result as string);
                setvehicleImageName2(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setvehicleImageName2(null);
        }
    };



    return (
        <>
            <div className="flex justify-center mt-10">
                <div className="w-10/12 overflow-hidden rounded-3xl shadow-2xl mt-14 mb-11">
                    <form className="w-full" onSubmit={formik.handleSubmit}>

                        <div className="m-5">
                            {readOnly ? (
                                <div onClick={() => SetReadOnly(!readOnly)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg>
                                </div>
                            ) : (
                                <div className="flex">
                                    <button
                                        type="submit"
                                        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        Save
                                    </button>
                                    <button type="button" onClick={() => SetReadOnly(!readOnly)}
                                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                                    >
                                        cancel
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="rounded-3xl">

                            <div className="flex mt-5 flex-wrap justify-around mx-3 mb-6">
                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Registration ID
                                    </label>
                                    <input
                                        type="text"
                                        name="registrationId"
                                        placeholder="Registration ID"
                                        readOnly={readOnly}
                                        value={formik.values.registrationId}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={without_error_class}
                                    />
                                    {formik.touched.registrationId && formik.errors.registrationId && (
                                        <div className="text-red-500 text-xs">{formik.errors.registrationId}</div>
                                    )}
                                </div>

                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Vehicle Model
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleModel"
                                        placeholder="Vehicle Model"
                                        readOnly={readOnly}
                                        value={formik.values.vehicleModel}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={without_error_class}
                                    />
                                    {formik.touched.vehicleModel && formik.errors.vehicleModel && (
                                        <div className="text-red-500 text-xs">{formik.errors.vehicleModel}</div>
                                    )}
                                </div>

                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Vehicle Type
                                    </label>
                                    <div className="pl-2 flex outline-none border-4 w-full rounded-lg p-2.5 sm:text-sm">
                                        <div className="flex">
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-radio-mini"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="mini"
                                                    disabled={readOnly}
                                                    checked={formik.values.vehicleType === "mini"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor="inline-radio-mini" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                                                    Mini
                                                </label>
                                            </div>
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-radio-suv"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="SUV"
                                                    disabled={readOnly}
                                                    checked={formik.values.vehicleType === "SUV"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor="inline-radio-suv" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                                                    SUV
                                                </label>
                                            </div>
                                            <div className="flex items-center mr-4">
                                                <input
                                                    id="inline-radio-prime"
                                                    type="radio"
                                                    name="vehicleType"
                                                    value="Prime"
                                                    disabled={readOnly}
                                                    checked={formik.values.vehicleType === "Prime"}
                                                    onChange={formik.handleChange}
                                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                />
                                                <label htmlFor="inline-radio-prime" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700">
                                                    Prime
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-around mx-3 mb-6">
                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Registration Image
                                        <img src={formik.values.rcImageUrl} className="rounded-lg max-h-44" />
                                        <input
                                            type="file"
                                            name="rcImageUrl"
                                            placeholder="Rc Image"
                                            className='hidden'
                                            onChange={handleRcImageChange}
                                        />
                                    </label>
                                </div>

                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Vehicle Image
                                        <img src={formik.values.vehicleImageUrl1} className="rounded-lg max-h-44" />
                                        <input
                                            type="file"
                                            name="vehicleImageUrl1"
                                            placeholder="Vehicle Image"
                                            className='hidden'
                                            onChange={handlevehicleImageUrl1Change}
                                        />
                                    </label>
                                </div>

                                <div className="px-3 mb-6 w-full md:w-1/2 lg:w-1/3 md:mb-0">
                                    <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                        Vehicle Image
                                        <img src={formik.values.vehicleImageUrl2} className="rounded-lg max-h-44" />
                                        <input
                                            type="file"
                                            name="vehicleImageUrl2"
                                            placeholder="Vehicle Image"
                                            className='hidden'
                                            onChange={handlevehicleImageUrl2Change}
                                        />
                                    </label>
                                </div>
                            </div>


                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default VehicleInfo

