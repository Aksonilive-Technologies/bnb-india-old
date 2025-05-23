"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchBookingforOwnerAtMybooking } from "@/actions/booking/booking.action";
import { FaBuilding, FaSearch } from "react-icons/fa";
import { getListingForOwner } from "@/actions/listing/listing.action";

export default function MyBooking() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State for filtered data
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  const fetchData = async () => {
    try {
      setFetching(true);
      const response: any = await fetchBookingforOwnerAtMybooking();


      console.log("Full API Response:", response);

      if (response?.status) {
        console.log(response.BookingforUser);
        setData(response?.BookingforUser || []);
        setFilteredData(response?.BookingforUser || []); // Initialize filtered data
      } else {
        console.warn("Response status is false or undefined.");
        setData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setFetching(false);
    }
  };

  // const [listings, setListings] = useState([]);
  // const fetchListingData = async () => {
  //   try {
  //     setFetching(true);
  //     const response: any = await getListingForOwner();


  //     console.log("Full API Response:", response);
  //     if (response?.status && Array.isArray(response?.Listing)) {
  //       const formattedListings = response.Listing.map((item: any) => ({
  //         title: item.title,
  //         image: item.image, // Ensure API returns `image`
  //       }));

  //       setListings(formattedListings);
  //     } else {

  //     }
  //   } catch (error) {
  //     console.error("Error fetching bookings:", error);
  //     setData([]);
  //     setFilteredData([]);
  //   } finally {
  //     setFetching(false);
  //   }
  // };

  useEffect(() => {
    fetchData();
    // fetchListingData();
  }, []);

  // Function to handle search
  const handleSearch = (query: any) => {
    setSearchQuery(query);
    if (query) {
      const filtered = data.filter((item: any) =>
        item?.villaname.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Reset to original data if query is empty
    }
  };

  const calculateNights = (startDate: any, endDate: any) => {
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="flex text-center justify-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="lg:max-w-[70vw] md:mx-auto ml-0 py-10 px-5 sm:px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-4xl text-left  w-full md:w-auto font-bold">Bookings</h1>
        {/* Search Input with Icon */}
        <div className="w-full md:w-auto my-4  relative">
          <input
            type="text"
            placeholder="Search by villa name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-600 transition-all duration-200 hover:border-pink-400"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div
        className="w-full mx-auto mt-3 p-3 rounded-lg grid grid-cols-1 gap-6 display-no-scroll overflow-y-auto"
        style={{ minHeight: "90vh" }}
      >
        {filteredData?.length > 0 ? (
          filteredData.map((d: any) => (
            <div
              key={d.bookingid}
              className="flex flex-col items-center w-full md:w-[95%] mx-auto h-auto md:h-[45vh] shadow-lg hover:shadow-xl duration-300 gap-6 p-6 rounded-lg bg-white hover:border-pink-600 border-2 border-transparent transition-all"
            >
              {/* Villa Name and Manage Booking */}
              <div className="w-full flex flex-col md:flex-row justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    {d?.villaname}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {d?.city}, {d?.state}
                  </p>
                  <p className="text-sm text-gray-500">
                    Booking ID: {d?.bookingid}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => {
                      router.push(`mybookings/${d.bookingid}/viewAndManage`);
                    }}
                    className="flex justify-center items-center w-full md:w-auto px-6 py-2 text-sm md:text-base red-gradient text-white rounded-lg font-semibold "
                    style={{ whiteSpace: "nowrap" }}
                  >
                    VIEW & MANAGE BOOKING
                  </button>
                  {/* Booking Status */}
                  <div className="font-semibold text-gray-700">
                    Booking Status:{" "}
                    <span
                      className={
                        d?.status === "Confirmed"
                          ? "text-green-600"
                          : d?.status === "Pending"
                            ? "text-yellow-600"
                            : d?.status === "Cancelled"
                              ? "text-red-600"
                              : "text-gray-600"
                      }
                    >
                      {d?.status}
                    </span>
                  </div>

                </div>
              </div>


              {/* Dotted Line */}
              <div
                className="w-full border-t-2 border-dashed border-gray-300"
                style={{ margin: "5px 0" }}
              ></div>

              {/* Booking Details */}
              <div className="w-full flex flex-col gap-4">
                <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap md:flex-nowrap flex-row items-center justify-between gap-4 shadow-sm">
                  {/* Check-in Info */}
                  <div className="text-sm flex flex-col text-gray-600">
                    <span className="text-[13px] font-medium text-gray-500">
                      Check-in:
                    </span>
                    <span className="text-lg text-gray-900">
                      {new Date(d?.villabookeddate).toDateString()}
                    </span>
                    <span className="text-[13px] font-medium text-gray-500">
                      Check-in from 11.00 am
                    </span>
                  </div>

                  {/* Check-out Info */}
                  <div className="text-sm flex flex-col text-gray-600">
                    <span className="text-[13px] font-medium text-gray-500">
                      Check-Out:
                    </span>
                    <span className="text-lg text-gray-900">
                      {new Date(d?.checkoutdate).toDateString()}
                    </span>
                    <span className="text-[13px] font-medium text-gray-500">
                      Check-Out at 12.00 pm
                    </span>
                  </div>

                  {/* Nights and Icon */}
                  <div className="flex flex-row md:flex-row justify-between items-center w-full md:w-[150px] gap-3">
                    <div className="flex flex-col text-gray-900">
                      <span className="text-lg font-semibold">
                        {calculateNights(d?.villabookeddate, d?.checkoutdate)}{" "}
                        night(s)
                      </span>
                    </div>
                    <FaBuilding className="text-2xl text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

          ))
        ) : (
          <div className="min-h-[70vh]">
            <p className="text-center text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>
    </div>
  );
}


