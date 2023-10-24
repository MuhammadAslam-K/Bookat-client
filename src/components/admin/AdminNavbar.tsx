import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminEndPoint from '../../Constraints/endPoints/adminEndPoint';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../services/redux/slices/adminAuth';

function Navbar() {

    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const handleAdminLogout = () => {
        dispatch(adminLogout())
        navigate(adminEndPoint.login)
    }

    return (
        <div className='flex justify-center bg-gray-100 '>
            <nav
                className={`relative w-5/6 mt-4 text-white ${isOpen ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700'
                    } hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2`}
            >
                <div className="container px-6 py-4 mx-auto">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <div className="flex items-center justify-between">

                            <Link to={adminEndPoint.dashboard}>
                                <div className="w-auto h-6 sm:h-7">Dashboard</div>
                            </Link>
                            {/* MOBILE VIEW */}
                            <div className="flex lg:hidden">
                                <button
                                    onClick={toggleMenu}
                                    type="button"
                                    className="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400"
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4 8h16M4 16h16"
                                            />
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
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu open: "block", Menu closed: "hidden */}
                        <div
                            className={`absolute inset-x-0 z-20 w-full px-6 py-4 transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 lg:mt-0 lg:p-0 lg:top-0 lg:relative lg:bg-transparent lg:w-auto lg:opacity-100 lg:translate-x-0 lg:flex lg:items-center ${isOpen ? 'translate-x-0 opacity-100' : 'opacity-0 -translate-x-full'
                                }`}
                        >
                            <div className="flex flex-col -mx-6 lg:flex-row lg:items-center lg:mx-8">
                                <Link to={adminEndPoint.user}

                                    className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"                               >
                                    Users
                                </Link>
                                <Link to={adminEndPoint.drivers}

                                    className="px-3 py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"                               >
                                    Drivers
                                </Link>

                                <p
                                    onClick={handleAdminLogout}

                                    className="px-3 cursor-pointer py-2 mx-3 mt-2 text-gray-700 transition-colors duration-300 transform rounded-md lg:mt-0 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"                               >
                                    Signout
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </nav >
        </div >
    );
}

export default Navbar;
