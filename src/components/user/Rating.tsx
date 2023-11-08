import React, { useState } from 'react';
import { userAxios } from '../../Constraints/axiosInterceptors/userAxiosInterceptors';
import userApis from '../../Constraints/apis/userApis';
import toast from 'react-hot-toast';
import userEndPoints from '../../Constraints/endPoints/userEndPoints';
import { useNavigate } from 'react-router-dom';
import { handleErrors } from '../../Constraints/apiErrorHandling';



const RatingReviewForm = (props: { rideId: string | null }) => {

    const { rideId } = props
    const navigate = useNavigate()
    const [selectedRating, setSelectedRating] = useState(0);
    const [review, setReview] = useState('')



    const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReview(event.target.value);
    };


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const data = { rideId, review, rating: selectedRating }
            const response = await userAxios.post(userApis.submitReview, data)
            console.log("response", response)
            toast.success("Thank you for submitting the feedback")
            navigate(userEndPoints.home)
        } catch (error) {
            console.log("error : ", error)
            handleErrors(error)
        }
    }

    const handleIgnoreReview = () => {
        navigate(userEndPoints.home)
    }

    return (
        <div className="flex items-center bg-gray-100 justify-center h-screen">
            <form className="p-4 bg-white w-1/4 rounded-3xl shadow-2xl" onSubmit={handleSubmit}>
                <h2 className="text-xl font-bold mb-4">Rate and Review</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Rating:</label>
                    <div className="ml-4 flex items-center space-x-2">
                        {[...Array(5)].map((_, index) => (
                            <svg
                                key={index}
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 576 512"
                                className={`h-6 my-4 w-6 fill-current cursor-pointer ${index + 1 <= selectedRating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300'
                                    }`}
                                onClick={() => setSelectedRating(index + 1)}
                            >
                                <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                            </svg>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Review:</label>
                    <textarea
                        value={review}
                        onChange={handleReviewChange}
                        className="w-full h-32 py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                    />
                </div>
                <div className="flex space-x-5">
                    <button
                        type='submit'
                        // onClick={() => handleSubmit()}
                        className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-700 focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                    <p
                        onClick={() => handleIgnoreReview()}
                        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline cursor-pointer"
                    >
                        Ignore
                    </p>
                </div>
            </form>
        </div>
    );
};

export default RatingReviewForm;