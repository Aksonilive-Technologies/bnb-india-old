import Image from 'next/image';

export default function ReviewCard({ data }: any) {
  const { profile_image, first_name, last_name, review_1, title, updatedAt } = data;

  return (
    <div className="card flex flex-col md:flex-row h-full bg-white p-6  rounded-lg max-w-lg cursor-pointer transition-all duration-300 drop-shadow-md hover:scale-[101%]">
      {/* Left Side: Image and Reviewer Details */}
      <div className="md:w-1/3 flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-md overflow-hidden mb-2 drop-shadow-sm">
          <Image
            src={profile_image}
            alt="Profile"
            width={90}
            height={90}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold">{first_name} {last_name}</h3>
          {title && (
  <h5 className="text-sm text-gray-400 font-semibold">
    Stay at {title}
  </h5>
)}

        </div>
      </div>
      
      {/* Right Side: Description and Date */}
      <div className="md:w-2/3 pl-3 flex flex-col justify-between">
        <p className="text-base font-normal text-black mt-4 overflow-hidden ">
          {review_1}
        </p>
        <span className="text-sm font-semibold w-full text-right text-gray-500 mt-2">{updatedAt}</span>
      </div>
    </div>
  );
}
