"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchBookingforUser } from "@/actions/booking/booking.action";
import { FaBuilding } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";

import DynamicHead from "@/components/DynamicHead";

interface MyBookingCardProps {
  bookingid: string;
  villaid: string;
  villaname: string;
  bookingamount: string;
  city: string;
  state: string;
  createdat: Date;
  checkoutdate: Date;
  checkindate: Date;
  bookinginvoicelink: string;
  addreviewflag: boolean;
  personname: string;
}

export default function MyBookingCard() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [activeReview, setActiveReview] = useState<string | null>(null);
  const [reviews, setReviews] = useState<{ [key: string]: string }>({});
  const [showThankYou, setShowThankYou] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [fetching, setfetching] = useState(true);
  const fetchData = async () => {
    try {
      setfetching(true);
      const response: any = await fetchBookingforUser();
      console.log("Full API Response:", response);

      if (response?.status) {
        setData(response?.BookingforUser || []);
      } else {
        console.warn("Response status is false or undefined.");
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setData([]); // Handle errors gracefully by resetting data
    } finally {
      setfetching(false);
    }
  };
  const statusLabels: any = {
    pending: { label: "🔄 Pending", color: "bg-yellow-100 text-yellow-700" },
    refundProcessing: {
      label: "🔁 Refund in Process",
      color: "bg-blue-100 text-blue-700",
    },
    refunded: { label: "✅ Refunded", color: "bg-green-100 text-green-700" },
    failed: { label: "❌ Payment Failed", color: "bg-red-100 text-red-700" },
    completed: {
      label: "🎉 Payment Completed",
      color: "bg-green-100 text-green-700",
    },
    Confirmed: { label: "📦 Confirmed", color: "bg-green-100 text-green-700" },
    confirmed: { label: "📦 Confirmed", color: "bg-green-100 text-green-700" },
    Cancelled: { label: "🚫 Cancelled", color: "bg-red-100 text-red-700" },
  };

  useEffect(() => {
    fetchData();
  }, []);
  if (fetching) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="  flex text-center justify-center">Loading...</p>;
      </div>
    );
  }
  const handleReviewSubmit = (bookingid: string, review: string) => {
    if (!review.trim()) {
      setError(true);
      return;
    }
    setError(false);
    console.log(
      `Review for booking ${bookingid}:`,
      review,
      `Rating: ${rating}`,
    );
    setShowThankYou(true);
    setActiveReview(null);
    setRating(0);
    setTimeout(() => setShowThankYou(false), 3214);
  };

  const handleStarClick = (index: number) => {
    setRating(index);
  };

  const clearRating = () => {
    setRating(0);
  };

  const calculateNights = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="lg:max-w-[70vw] md:mx-auto ml-0 py-10 px-5 sm:px-4 ">
      <DynamicHead title={"My Bookings"} />
      <div className="text-gray-500 flex items-center justify-start gap-2 mb-5">
        <a
          href="/profile"
          className="hover:text-pink-600 text-lg font-semibold transition-colors"
        >
          Account
        </a>
        <SlArrowRight size={14} className="text-gray-400" />
        <a
          href="#"
          className="hover:text-blue text-lg font-semibold transition-colors"
        >
          Bookings
        </a>
      </div>

      <h1 className="md:text-4xl text-2xl font-bold">Bookings</h1>

      <div
        className="w-full mx-auto  mt-3 p-3 rounded-lg grid grid-cols-1 gap-6 display-no-scroll overflow-y-auto"
        style={{ minHeight: "90vh" }}
      >
        {data?.length > 0 ? (
          data.map((d: any) => (
            <div
              key={d.bookingid}
              className="flex flex-col items-center w-full md:w-[95%] mx-auto  h-[60vh] md:h-[45vh] shadow-lg hover:shadow-xl duration-300 gap-6 p-6 rounded-lg bg-white hover:border-pink-600 border-2 border-transparent transition-all"
            >
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
                <div className="flex flex-col items-end gap-1">
                  <button
                    onClick={() => {
                      router.push(`mybookings/${d.bookingid}/viewAndManage`);
                    }}
                    className="flex justify-center items-center w-full md:w-auto px-6 py-1 text-sm md:text-base red-gradient text-white rounded-lg font-semibold "
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
                  <p className="text-sm text-gray-500">
                    Booking on : {new Date(d?.createdat).toDateString()}
                  </p>
                </div>
              </div>
              {/* Dotted Line */}
              <div className="w-full border-t-2 border-dashed border-gray-300"></div>

              {/* Booking Details */}
              <div className="w-full flex flex-col gap-4">
                <div className="bg-gray-100 p-4 rounded-lg flex flex-wrap md:flex-nowrap flex-row items-center justify-between gap-4 shadow-sm">
                  {/* Check-in Info */}
                  <div className="text-sm flex flex-col text-gray-600">
                    <span className="text-[13px] font-medium text-gray-500">
                      Check-in:
                    </span>
                    <span className="text-lg text-gray-900">
                      {new Date(d?.checkindate).toDateString()}
                      {/* {(d?.checkindate)} */}
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
                        {calculateNights(d?.checkindate, d?.checkoutdate)}{" "}
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
          <div className=" min-h-[70vh]">
            <p className="text-center text-gray-500">No bookings found.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .grid-cols-2 {
            grid-template-columns: repeat(1, minmax(0, 1fr));
          }
        }
      `}</style>

      {activeReview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl relative z-50">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              Write a Review
            </h2>
            <p className="text-gray-600 mb-4">
              Share your experience with this villa. Your feedback helps us
              improve and assists future guests in making better choices.
            </p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Rate Us</p>
            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`cursor-pointer text-3xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                >
                  ★
                </span>
              ))}
              <button
                className="text-sm bg-gray-200 px-2 py-1 rounded-md text-gray-700 hover:bg-gray-300 ml-3"
                onClick={clearRating}
              >
                Clear
              </button>
            </div>
            <textarea
              className={`w-full h-[180px] p-4 text-gray-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                error ? "border-red-500" : ""
              }`}
              placeholder="Describe your experience here..."
              value={reviews[activeReview] || ""}
              onChange={(e) => {
                setReviews({
                  ...reviews,
                  [activeReview]: e.target.value,
                });
                setError(false);
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">
                Please write something before submitting.
              </p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                onClick={() => setActiveReview(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
                onClick={() =>
                  handleReviewSubmit(activeReview, reviews[activeReview] || "")
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showThankYou && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-green-500 text-white rounded-lg px-8 py-4 text-center shadow-lg">
            <h3 className="text-xl font-bold">Thank You!</h3>
            <p>Your review has been submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
