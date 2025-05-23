import { FaStar } from "react-icons/fa";


interface StarRatingProps {
  rating: any;
  size : number
}

const StarRating: React.FC<StarRatingProps> = ({ rating , size =5}) => {
  // Calculate number of full stars
  const fullStars = Math.floor(rating);

  // Calculate percentage of yellow for the last star
  const yellowPercentage = (rating - fullStars) * 100;

  return (
    <div className="flex gap-1 drop-shadow-sm shadow-black">
      {/* Full yellow stars */}
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`text-[#e1fa00] size-${size}`} />
      ))}
      {/* Last star with partial yellow */}
      {yellowPercentage > 0 && (
        <div className="relative inline-block">
          <FaStar className={`text-gray-300 size-${size}`} />
          <div
            className="absolute top-0 left-0 overflow-hidden"
            style={{ width: `${yellowPercentage}%` }}
          >
            <FaStar className={`text-[#e1fa00] size-${size}`} />
          </div>
        </div>
      )}
      {/* Gray stars for remaining empty stars */}
      {[...Array(5 - Math.ceil(rating))].map((_, index) => (
        <FaStar key={index} className={`text-gray-200 size-${size}`} />
      ))}
    </div>
  );
};

export default StarRating;
