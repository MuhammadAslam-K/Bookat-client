import { useFormik } from "formik";
import { handleErrors } from "../../../Constraints/apiErrorHandling";
import { adminAxios } from "../../../Constraints/axiosInterceptors/adminAxiosInterceptors";
import adminApis from "../../../Constraints/apis/adminApis";
import * as Yup from "yup"
import { useState } from "react";
import { uploadImageToStorage } from "../../../services/firebase/storage";
import { customLoadingStyle } from "../../../Constraints/customizeLoaderStyle";
import toast from "react-hot-toast";


type AddCabModalProps = {
    handleCabResult: () => void;
};

function AddCabModal({ handleCabResult }: AddCabModalProps) {
    const [cabImage, SetCabImage] = useState<string | null>(null);
    const [cabImageName, SetCabImageName] = useState<string | null>(null);

    const without_error_class = "pl-2 outline-none border-2 w-full rounded-lg p-2.5 sm:text-sm";
    const with_error_class = "pl-2 outline-none border-2 border-red-400 w-full rounded-lg p-2.5 sm:text-sm";



    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                SetCabImage(reader.result as string);
                SetCabImageName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            SetCabImage(null);
            SetCabImageName(null);
        }
    };

    const formik = useFormik({
        initialValues: {
            cabType: "",
            maxPersons: "",
            pricePerKm: "",
        },
        validationSchema: Yup.object({
            cabType: Yup.string()
                .max(10, "Enter a valid Input")
                .required("Please Enter value"),
            maxPersons: Yup.number()
                .min(2, "Enter a valid Input")
                .max(10, "Enter a valid Input")
                .required("Please Enter value"),
            pricePerKm: Yup.number()
                .min(50, "Enter a valid Input")
                .max(500, "Enter a valid Input")
                .required("Please Enter value"),
        }),
        onSubmit: (values) => {
            console.log(56)
            handleSubmit(values)
        },
    });

    const handleSubmit = async (values: { cabType: string; maxPersons: string; pricePerKm: string; }) => {
        console.log(61)
        try {
            toast.loading('Submitting the form please wait...', {
                style: customLoadingStyle,
            });

            const result = await uploadImageToStorage(cabImage, cabImageName, "admin", "cab")
            const form = {
                ...values,
                result,
            }
            const response = await adminAxios.post(adminApis.addCab, form)
            console.log("response", response)
            console.log(response.data)
            toast.dismiss()
            handleCabResult()
        } catch (error) {
            toast.dismiss()
            handleErrors(error)
        }
    }



    return (
        <div>
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>
                <form className="modal-content w-3/12 bg-white p-6 rounded-lg shadow-lg z-50" onSubmit={formik.handleSubmit}>
                    <h1 className='text-center font-semibold text-2xl'>Add New Cab Type</h1>

                    <div className="mt-4">
                        <label htmlFor="maxPersons" className="block text-sm font-medium text-gray-700">Cab Type</label>
                        <input
                            type="text"
                            name="cabType"
                            placeholder="Cab Type"
                            required
                            value={formik.values.cabType}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={
                                formik.touched.cabType && formik.errors.cabType
                                    ? with_error_class
                                    : without_error_class
                            }
                        />
                        {formik.touched.cabType && formik.errors.cabType && (
                            <div className="text-red-500 text-xs">{formik.errors.cabType}</div>
                        )}
                    </div>


                    <div className="mt-4">
                        <label htmlFor="maxPersons" className="block text-sm font-medium text-gray-700">Max Persons</label>
                        <input
                            type="text"
                            name="maxPersons"
                            placeholder="Max Persons"
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
                        {formik.touched.maxPersons && formik.errors.maxPersons && (
                            <div className="text-red-500 text-xs">{formik.errors.maxPersons}</div>
                        )}
                    </div>


                    <div className="mt-4">
                        <label htmlFor="maxPersons" className="block text-sm font-medium text-gray-700">Price Per KM</label>
                        <input
                            type="text"
                            name="pricePerKm"
                            placeholder="Price Per KM"
                            required
                            value={formik.values.pricePerKm}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={
                                formik.touched.pricePerKm && formik.errors.pricePerKm
                                    ? with_error_class
                                    : without_error_class
                            }
                        />
                        {formik.touched.pricePerKm && formik.errors.pricePerKm && (
                            <div className="text-red-500 text-xs">{formik.errors.pricePerKm}</div>
                        )}
                    </div>

                    <div className='mb-6 flex space-x-20'>
                        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-slate-100">

                            {cabImage ?
                                <img src={typeof cabImage === 'string' ? cabImage : URL.createObjectURL(cabImage)} className="max-h-32 w-full object-cover mt-4" />
                                :
                                <><svg className="w-8 h-12" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                                </svg><span className="mt-2 text-base leading-normal">Cab Image</span></>
                            }
                            <input
                                type="file"
                                name="cabImage"
                                placeholder="Aadhar Image"
                                required
                                className='hidden'
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <div className="flex">
                        <button type="submit" className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ">Submit</button>
                        <p onClick={handleCabResult} className="cursor-pointer text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Cancel</p>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default AddCabModal