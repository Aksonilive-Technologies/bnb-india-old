'use client'


import Link from 'next/link';
import React, { useState, useMemo } from 'react';

export default function ReservationDetails({ bookings }: { bookings: any }) {
  const [showHosted, setShowHosted] = useState(true);

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);

    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };

    return date.toLocaleDateString('en-GB', options);
  }

  // Memoize the categorized bookings to avoid recalculating on every render
  const { currentlyHosted, upcomingArrival } = useMemo(() => {
    const hosted: any[] = [];
    const upcoming: any[] = [];
    const today = new Date();

    bookings.forEach((booking: any) => {
      const checkinDate = new Date(booking.checkinDate);
      const checkoutDate = new Date(booking.checkoutDate);

      if (today >= checkinDate && today <= checkoutDate) {
        hosted.push(booking);
      } else if (today < checkinDate) {
        upcoming.push(booking);
      }
    });
    console.log(hosted, upcoming);

    return { currentlyHosted: hosted, upcomingArrival: upcoming };
  }, [bookings]);

  return (
    <div className="bg-white shadow  rounded-lg p-5 w-full md:w-[40vw] mx-2 sm:mx-0 md:flex-grow">
      <div className="flex mb-2 gap-3 relative">
        {/* Hosted Button */}
        <button
          onClick={() => setShowHosted(true)}
          className={`relative px-3 py-1.5 border font-medium text-sm transition-all duration-300 rounded-lg ${showHosted
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-black hover:bg-black hover:text-white'
            }`}
        >
          Currently  Hosted
          {/* Show dot if upcomingArrival has data */}
          {currentlyHosted.length > 0 && !showHosted && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>

        {/* Arrivals Button */}
        <button
          onClick={() => setShowHosted(false)}
          className={`relative px-3 py-1.5 border font-medium text-sm transition-all duration-300 rounded-lg ${!showHosted
            ? 'bg-black text-white border-black'
            : 'bg-white text-black border-black hover:bg-black hover:text-white'
            }`}
        >
          Upcoming Arrivals
          {/* Show dot if currentlyHosted has data */}
          {upcomingArrival.length > 0 && showHosted && (
            <span className="absolute top-0 right-0 -mt-1 -mr-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </button>
      </div>




      <div className="h-auto display-no-scroll overflow-y-auto  custom-scroll scroll-smooth">
        {(showHosted ? currentlyHosted : upcomingArrival).length === 0 ? (
          <p className="text-center text-gray-500 py-4 text-sm font-medium">
            No results found
          </p>
        ) : (
          <ul className=" flex flex-col gap-2 ">
            {(showHosted ? currentlyHosted : upcomingArrival).map((d, index) => (
              <li
                key={index}
                className="p-4 rounded-lg hover:bg-gray-100 border border-gray-300 cursor-pointer transition-all duration-200"
              >
                <Link href={`/hostpanel/mybookings/${d.id}/viewAndManage`}>



                  <p className="text-sm  text-gray-900">Booked by {d.name} at {d.villa_name}</p>
                  <p className="text-xs py-1 font-medium text-gray-500">
                    {formatTimestamp(d.checkinDate)} - {formatTimestamp(d.checkoutDate)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}



