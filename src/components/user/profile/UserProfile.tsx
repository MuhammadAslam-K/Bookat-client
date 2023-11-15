import { useEffect, useState, Suspense, lazy } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup"

import userEndPoints from '../../../Constraints/endPoints/userEndPoints';
import { userLogin } from '../../../services/redux/slices/userAuth';
import { userAxios } from '../../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../../Constraints/apis/userApis';
import { handleErrors } from '../../../Constraints/apiErrorHandling';
import { UserProfileData } from '../../../interfaces/user';

const WalletComponent = lazy(() => import("./userWalletHistory"))




function UserProfile() {
    const [readOnly, setReadOnly] = useState(true);
    const [reload, SetReload] = useState(true);
    const [wallet, setWallet] = useState(false)
    const [walletData, setWalletData] = useState([])


    const dispatch = useDispatch();
    const navigate = useNavigate()



    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await userAxios.get(userApis.profile)

                const data: UserProfileData = {
                    name: response.data.name,
                    email: response.data.email,
                    mobile: response.data.mobile,
                    refrel: response.data.refrel,
                    joinedAt: response.data.joinedAt,
                    totalRides: response.data.RideDetails.completedRides,
                    wallet: {
                        balance: response.data.wallet.balance,
                    },
                }
                setWalletData(response.data.wallet)
                console.log(response.data.wallet)
                console.log(response)
                formik.setValues(data);

            } catch (error) {
                console.log(error)
                handleErrors(error)
            }
        }
        fetchData()

    }, [reload])


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            refrel: '',
            joinedAt: '',
            totalRides: '',
            wallet: {
                balance: '',
            },
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
        }),
        onSubmit: async (values) => {
            console.log(values)
            handleUpdateProfile(values)
        }
    })

    const handleUpdateProfile = async (values: UserProfileData) => {
        try {
            const response = await userAxios.post(userApis.updateProfile, values)
            SetReload(!reload)
            setReadOnly(!readOnly)

            dispatch(userLogin({ userId: response.data._id, mobile: response.data.mobile }));
        } catch (error) {
            console.log(error);
            SetReload(!reload)
            setReadOnly(!readOnly)
            handleErrors(error)
        }
    }

    const withoutErrorClass = 'pl-2 outline-none rounded-lg p-2.5 sm:text-sm block  text-gray-700 border mb-3 leading-tight';

    return (

        <>

            {wallet ?
                <div className='bg-gray-100 h-screen'>
                    <Suspense fallback={<div>Loading...</div>}>
                        <WalletComponent transactions={[]} {...walletData} />
                    </Suspense>
                </div>
                :

                <div className="flex mt-20 justify-center" >
                    <div className="lg:w-9/12 w-11/12 mb-40 overflow-hidden rounded-3xl bg-gray-100 shadow-2xl sm:flex justify-center">
                        <div className="w-full ">
                            <div className="p-8">
                                {formik.values &&
                                    <form className="" onSubmit={formik.handleSubmit}>

                                        <div >
                                            {readOnly ? (
                                                <div onClick={() => setReadOnly(!readOnly)}>
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
                                                    <button type="button" onClick={() => setReadOnly(!readOnly)}
                                                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
                                                        cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col md:flex-row lg:ms-36  mt-5">

                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="name"
                                                    required
                                                    readOnly={readOnly}
                                                    value={formik.values.name}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={withoutErrorClass}
                                                />
                                                {formik.touched.name && formik.errors.name && (
                                                    <div className="text-red-500 text-xs">{formik.errors.name}</div>
                                                )}
                                            </div>

                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Email
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    placeholder="Email"
                                                    required
                                                    readOnly={readOnly}
                                                    value={formik.values.email}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={withoutErrorClass}
                                                />
                                                {formik.touched.email && formik.errors.email && (
                                                    <div className="text-red-500 text-xs">{formik.errors.email}</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row lg:ms-36 mt-5">
                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Mobile
                                                </label>
                                                {(formik.values.mobile || !readOnly) &&
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="mobile"
                                                            placeholder="Mobile"
                                                            required
                                                            readOnly={readOnly}
                                                            value={formik.values.mobile}
                                                            onChange={formik.handleChange}
                                                            onBlur={formik.handleBlur}
                                                            className={withoutErrorClass}
                                                        />
                                                        {formik.touched.mobile && formik.errors.mobile && (
                                                            <div className="text-red-500 text-xs">{formik.errors.mobile}</div>
                                                        )}
                                                    </>
                                                }
                                            </div>

                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Refrel
                                                </label>
                                                <input
                                                    type="text"
                                                    name="refrel"
                                                    placeholder="Refrel"
                                                    required
                                                    readOnly
                                                    value={formik.values.refrel}
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    className={withoutErrorClass}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row lg:ms-36 mt-5">
                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Total Rides
                                                </label>
                                                <input
                                                    type="text"
                                                    name="totalRides"
                                                    required
                                                    readOnly
                                                    value={formik.values.totalRides}
                                                    className="pl-2 outline-none rounded-lg bg-gray-100 p-2.5 sm:text-sm block  text-gray-700  mb-3 leading-tight"
                                                />
                                                <p className='cursor-pointer' onClick={() => navigate(userEndPoints.rideHistory)}>Ride History</p>
                                            </div>

                                            <div className='mb-4 w-full md:w-1/2'>
                                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" >
                                                    Wallet
                                                </label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    placeholder="Email"
                                                    required
                                                    readOnly
                                                    value={formik.values.wallet.balance}
                                                    className="pl-2 outline-none rounded-lg bg-gray-100 p-2.5 sm:text-sm block  text-gray-700  mb-3 leading-tight"
                                                />
                                                <p onClick={() => setWallet(!wallet)}
                                                    className='cursor-pointer'>Wallet History</p>
                                            </div>
                                        </div>

                                    </form>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>

    );
}

export default UserProfile;