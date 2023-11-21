import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userEndPoints from '../../../Constraints/endPoints/userEndPoints';
import driverEndPoints from '../../../Constraints/endPoints/driverEndPoints';
import { userLogout } from '../../../services/redux/slices/userAuth';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { rootState } from '../../../interfaces/comman';

function UserNavbar() {

    const user = useSelector((state: rootState) => state.user.loggedIn);

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const [toggleisOpen, setToggleIsOpen] = useState(false);

    const handleSignOut = () => {
        try {
            console.log(user)
            dispatch(userLogout());
            navigate(userEndPoints.login)

        } catch (error) {
            toast.error((error as Error).message)
        }
    }

    return (
        <div className="flex justify-center bg-gray-100">
            <nav
                className={`relative w-full text-blue-800 ${isOpen ? 'bg-white' : 'bg-white'
                    } hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-white-500/50 dark:shadow-lg dark:white-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
            >
                <div className="container px-6 py-2 mx-auto">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between">
                            <Link to={userEndPoints.home}>
                                <div className="w-auto ms-20 text-4xl font-semibold">Book@</div>
                            </Link>
                            {/* MOBILE VIEW */}
                            <div className="flex lg:hidden">
                                <button
                                    onClick={toggleMenu}
                                    type="button"
                                    className="text-black-500 dark:black-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
                                    aria-label="toggle menu"
                                >
                                    {!isOpen ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-6 h-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu open: "block", Menu closed: "hidden */}
                        <div
                            className={`absolute inset-x-0 z-20 me-10 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
                                }`}
                        >
                            <div className="flex flex-col text-xl -mx-6 lg:flex-row lg:items-center lg:mx-8">
                                {/* <Link
                                    to="/about"
                                    className="px-3 py-2 mx-3 mt-2 text-black-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-black-200 hover:text-gray-100 dark:hover:bg-blue-700"
                                >
                                    About
                                </Link> */}
                                <Link
                                    to={userEndPoints.currentRide}
                                    className="px-3 py-2 mx-3 mt-2 text-black-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-black-200 hover:text-gray-100 dark:hover:bg-blue-700"
                                >
                                    Ride
                                </Link>

                                <div className="avatar placeholder"
                                    onClick={() => setToggleIsOpen(!toggleisOpen)}
                                    aria-label="toggle dropdown"
                                >
                                    <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                                        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>

                                    </div>
                                </div>

                            </div>

                            {toggleisOpen && (
                                <div
                                    onClick={() => setToggleIsOpen(false)}
                                    className="absolute right-0 z-20 w-48 py-2 mt-48 origin-top-right shadow-xl rounded-3xl overflow-hidden bg-white"
                                >
                                    <Link
                                        to={userEndPoints.profile}
                                        className="block px-4 py-3 text-sm text-gray-600 capitalize transition-colors duration-300 transform dark-text-gray-300 hover-bg-gray-100 dark-hover-bg-gray-700 dark-hover-text-white"
                                    >
                                        Your Profile
                                    </Link>
                                    <Link to={driverEndPoints.login}
                                        className="block px-4 py-3 text-sm text-gray-600  transition-colors duration-300 transform dark-text-gray-300 hover-bg-gray-100 dark-hover-bg-gray-700 dark-hover-text-white"
                                    >
                                        SignIn as Driver
                                    </Link>
                                    {user ?
                                        <p
                                            onClick={handleSignOut}
                                            className="block px-4 py-3 cursor-pointer text-sm text-gray-600 capitalize transition-colors duration-300 transform dark-text-gray-300 hover-bg-gray-100 dark-hover-bg-gray-700 dark-hover-text-white"
                                        >
                                            Sign Out
                                        </p>
                                        :
                                        <Link to={userEndPoints.login}

                                            className="block px-4 py-3 cursor-pointer text-sm text-gray-600 capitalize transition-colors duration-300 transform dark-text-gray-300 hover-bg-gray-100 dark-hover-bg-gray-700 dark-hover-text-white"
                                        >
                                            Login
                                        </Link>
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default UserNavbar;
