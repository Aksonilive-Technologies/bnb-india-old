// pages/confirm-listing.js
'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ConfirmListingPage = () => {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");


  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(today.toLocaleDateString(undefined, options));
  }, []);

  return (
    <div className="flex h-[91vh] bg-gray-100">
      {/* Left Side */}
      <div className="w-full md:w-[40%] flex flex-col justify-center items-center p-8 md:m-8 relative">
        <div className="absolute top-4 left-4 text-md font-[4px] text-gray-600">
          {currentDate}
        </div>
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Listing Created Successfully</h1>
        <p className="text-lg text-gray-600 mb-6">
          Thank you for uploading your property on our site.
        </p>
        <button
          onClick={() => router.push('/hostpanel/listings')}
          className="mt-6 px-6 py-3 border border-blue-800 text-blue-800 rounded-lg transform hover:scale-105 transition-transform duration-300"
        >
          See your listing
        </button>
      </div>
      {/* Right Side */}
      <div className="w-full hidden md:flex md:w-[60%] bg-gradient-to-r from-blue-800 to-blue-900 text-white  flex-col justify-center items-center p-8 md:p-12 relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('/path/to/background-pattern.svg')] bg-center bg-cover"></div>
        <div className="relative text-center max-w-xl">
          <p className="text-2xl md:text-4xl font-bold mb-4">
            "The best way to predict the future is to create it."
          </p>
          <p className="text-lg md:text-xl font-medium italic mb-6">
            - Peter Drucker
          </p>
          <p className="text-md md:text-lg mt-4">
            We are thrilled to have your property listed with us. Your journey to connecting with potential guests starts here. Keep your listing updated and watch the reservations come in!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmListingPage;
