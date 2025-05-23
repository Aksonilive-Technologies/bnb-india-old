'use client'

import { fetchBookingForOwner, recentDataForOwner } from "@/actions/booking/booking.action";
import ReservationDetails from "@/components/shared/hostPanel/Reservationdetails";
import RecentActivity from "@/components/shared/hostPanel/RecentActivity";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HostPanel() {
  const [bookings, setBookings] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  // const [cancelationCount, setCancelationCount] = useState(0);
  const [recentData, setRecentData] = useState<any>({
    totalCancellations: 0,
    totalBookings: 0,
    totalReviews: 0,
  });


  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchBookingForOwner();
      if (!response.success) {
        throw new Error(`Error: ${response.error}`);
      }
      console.log("Booking Data:", response.bookings);

      const data = response.bookings;
      setBookings(data);
      // let cnt = 0;

      // data?.map((d: any) => {
      //   if (d.status == 'cancelled') {
      //     cnt++;
      //   }
      // })
      // setCancelationCount(cnt);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      // setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const fetchRecentBookings = async () => {
    try {
      const response: any = await recentDataForOwner();
      console.log("response data is ", response.data);
      if (response.success) {
        setRecentData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    fetchRecentBookings();
    console.log("fetchBookingForOwner");

    fetchBookings();
  }, []);


  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 my-3 flex  gap-4 mt-6 flex-col md:flex-row sm:flex-col-reverse">
      <div className="bg-white shadow rounded-lg  p-3 sm:p-5  w-full md:w-[50vw] mx-2 sm:mx-0 md:flex-grow">
        <h3 className="text-lg  font-medium text-gray-900 mb-4 sm:sticky top-0">
          Recent Activities
        </h3>
        <div className="h-[50vh] sm:h-[80vh] display-no-scroll md:h-[70vh]  overflow-y-scroll custom-scroll scroll-smooth">
          <RecentActivity />
        </div>
      </div>

      <div>

      </div>

      <div className="flex flex-col">
        <ReservationDetails bookings={bookings} />

        {/* <button className="w-full h-16 rounded-xl border-gray-400 border-2 flex items-center justify-center p-2 text-xl font-semibold gap-3 hover:bg-black hover:text-gray-100">
          <p>Get the resources and tips</p>
        </button> */}

      </div>

      <div className="w-full md:w-[15vw]">
        <p className="text-center text-lg font-bold py-3 uppercase text-gray-800 tracking-wide">
          Last 30 Days Activities
        </p>


        <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-1 gap-4">
          {/* New Bookings */}
          <Link
            href="/hostpanel/mybookings"
            className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border border-gray-300 min-h-[100px]"
          >
            {isLoading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-20 bg-gray-300 animate-pulse rounded-md"></div>
                <div className="h-3 w-24 bg-gray-300 animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-black">{recentData.totalBookings}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-600 text-center mt-2">
                  New Bookings
                </p>
              </>
            )}
          </Link>

          {/* Cancellations */}
          <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border border-gray-300 min-h-[100px]">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="h-8 w-20 bg-gray-300 animate-pulse rounded-md"></div>
                <div className="h-3 w-24 bg-gray-300 animate-pulse rounded"></div>
              </div>
            ) : (
              <>
                <p className="text-4xl font-bold text-black">{recentData.totalCancellations}</p>
                <p className="text-xs sm:text-sm font-medium text-gray-600 text-center mt-2">
                  Recent Cancellations
                </p>
              </>
            )}
          </div>

          {/* New Reviews */}
          <Link href="/hostpanel/comments">
            <div className="bg-white shadow-sm rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col items-center justify-center border border-gray-300 min-h-[100px]">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="h-8 w-20 bg-gray-300 animate-pulse rounded-md"></div>
                  <div className="h-3 w-24 bg-gray-300 animate-pulse rounded"></div>
                </div>
              ) : (
                <>
                  <p className="text-4xl font-bold text-black">{recentData.totalReviews}</p>
                  <p className="text-xs sm:text-sm font-medium text-gray-600 text-center mt-2">
                    New Reviews
                  </p>
                </>
              )}
            </div>
          </Link>
        </div>



      </div>


    </div>
  );
}


const SkeletonLoader = () => {
  return (
    <div className=" gap-1 flex items-center flex-col">
      {Array(3).fill(0).map((_, index) => (
        <div key={index} className="p-4 rounded-lg w-full border border-gray-200 bg-gray-100 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};