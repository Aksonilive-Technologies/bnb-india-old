"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { fetchReviewForOwner } from "@/actions/review/review.action";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { format } from "date-fns";

const ReviewCard = ({ data }: any) => {
  const {
    reviewerImage,
    reviewedBy,
    review_1,
    review_2,
    title,
    updatedAt,
    rating,
  } = data;

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="flex flex-row items-center h-auto md:items-start md:justify-between md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-300 gap-4 p-3 md:p-6 md:rounded-lg bg-white md:hover:border hover:border-pink-600">
      {/* Left Side: Image and Reviewer Details */}
      <div className="md:w-1/3 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-2 drop-shadow-sm">
          <Image
            src={reviewerImage || "/images/default-profile.jpg"}
            alt="Profile"
            width={90}
            height={90}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">{reviewedBy}</h3>
          <h5 className="text-sm text-gray-400 font-semibold">
            Stay at {title}
          </h5>
        </div>
      </div>

      {/* Right Side: Description, Rating, and Date */}
      <div className="md:w-2/3 pl-3 h-full flex flex-col justify-between">
        <div className="flex items-center gap-1 text-yellow-500 mt-2">
          {renderRating(rating)}
        </div>
        <p className="text-base font-normal text-black mt-4 overflow-hidden">
          {review_1}
        </p>
        <span className="text-sm font-semibold w-full text-right text-gray-500 mt-2">
          {format(new Date(updatedAt), "MMM d, yyyy, hh:mm a")}{" "}
          {/* Outputs: Jan 28, 2025, 03:56 PM */}
        </span>
      </div>
    </div>
  );
};

const Comments: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);

  const fetchReviews = async () => {
    try {
      const response: any = await fetchReviewForOwner(); // Replace with your actual API route
      console.log(response);
      if (response.success) {
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Filter Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-4xl font-bold">User Reviews</h1>
        <button
          onClick={toggleFilter}
          className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300"
        >
          Filter Reviews
        </button>
      </div>

      {/* Loading or Reviews Grid */}
      {loading ? (
        <div className="text-center">
          <p>Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 mt-[10vh] sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} data={review} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p>No reviews found.</p>
        </div>
      )}

      {/* Filter Modal (Optional) */}
      {filterOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Filter Options</h2>
            <button
              onClick={() => setFilterOpen(false)}
              className="bg-gray-200 text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
[
  {
    villareviews_id: "cm6go2e1c0001ggfcxisper9g",
    villaId: "cm6g8dtxy0000aql080hi81gq",
    bookingId: "cm6eyfdrk0000j3tqaxlid27v",
    user_id: "qKPlcbW3uuf7PnsHLgg8IsIcqqo1",
    star_1: 1,
    star_2: 3,
    star_3: 9,
    review_1: "nice place to be there ",
    review_2: "great vibeee",
    createdAt: "2025-01-28T16:03:02.701Z",
    updatedAt: "2025-01-28T15:56:42.813Z",
    villaName: "",
    type: "villaReview",
  },
];
