import { useLocation } from 'react-router-dom';
import RatingReviewForm from '../../../components/user/Rating'
import queryString from 'query-string';
import UserNavbar from "../../../components/user/common/UserNavbar"

function UserReviewAndRatingPage() {

    const location = useLocation();
    const { rideId } = queryString.parse(location.search) as {
        rideId: string | null;
    };

    const data = { rideId };

    return (
        <div>
            <UserNavbar />
            <RatingReviewForm {...data} />
        </div>
    )
}

export default UserReviewAndRatingPage