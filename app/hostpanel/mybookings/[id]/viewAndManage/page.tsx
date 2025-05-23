"use client";

import React, { useEffect, useState } from "react";

import {
  getreciptData,
} from "@/actions/booking/booking.action";
import ImageWithFallBack from "@/components/shared/ImageFallback";
import { useParams } from "next/navigation";
import { formatNumberWithCommas } from "@/app/details/[id]/paymentUtils/utils";
import BookingCancellationPolicy from "@/components/shared/bookingCancellationPolicy";

// Adjust the path as necessary

const ViewAndManage = () => {
  const params = useParams()
  const { id }: any = params
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState("");
  console.log(id);
  const fetchBookingData = async () => {
    try {
      const response: any = await getreciptData(id);
      console.log(response);

      if (response.success) {
        console.log(response?.data);

        setBookingData(response?.data);
      } else {
        setError(response?.error || "Failed to fetch booking data.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, [id]);

  const statusLabels: any = {
    pending: { label: "🔄 Pending", color: "bg-yellow-100 text-yellow-700" },
    Pending: { label: "🔄 Pending", color: "bg-yellow-100 text-yellow-700" },
    refundProcessing: { label: "🔁 Refund in Process", color: "bg-blue-100 text-blue-700" },
    refunded: { label: "✅ Refunded", color: "bg-green-100 text-green-700" },
    failed: { label: "❌ Payment Failed", color: "bg-red-100 text-red-700" },
    completed: { label: "🎉 Payment Completed", color: "bg-green-100 text-green-700" },
    confirmed: { label: "📦 Confirmed", color: "bg-green-100 text-green-700" },
    Confirmed: { label: "📦 Confirmed", color: "bg-green-100 text-green-700" },
    cancelled: { label: "🚫 Cancelled", color: "bg-red-100 text-red-700" },
    processing: { label: "⏳ Processing", color: "bg-orange-100 text-orange-700" },
    onHold: { label: "⏸️ On Hold", color: "bg-gray-100 text-gray-700" }
  };

  const defaultStatus: any = { label: "Not Found", color: "bg-gray-100 text-gray-700" }
  if (loading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Loading...
      </div>
    );
  if (error) return <div className="min-h-[70vh] flex items-center justify-center">Error: {error}</div>;

  const { booking, villa, transaction, owner, user }: any = bookingData || {};

  return (
    <div className="bg-gray-50 p-6">
      {/* Header Section */}
      {isPopupOpen && (
        <BookingCancellationPolicy setIsPopupOpen={setIsPopupOpen} cancellationType={villa.cancellationType} />
      )}
      <header className="bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Booking Completed</h1>
        <p className="text-sm">
          You have completed your booking. We hope you had a pleasant stay!
        </p>
      </header>

      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {/* Left Section */}

        <section className="md:col-span-2 bg-white rounded-lg p-[15px] md:p-12 ">
          {/* Hotel Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 p-4 bg-white rounded-lg  w-full">
            {/* Left Side Content */}
            <div className="flex flex-col items-start space-y-4 w-full sm:w-2/3">
              <h2 className="text-2xl font-bold">
                <a
                  href={`/details/${villa?.listing_id}`}
                  className="hover:text-blue-500 transition duration-300"
                >
                  {villa?.title}
                </a>
              </h2>

              <p className="text-gray-700 text-sm">
                📍 {villa?.address}, {villa?.area_name}, {villa?.city}, {villa?.state}
              </p>

              <p className="text-gray-700 text-sm">
                📞 Contact: {owner?.phone_number}
              </p>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center w-full sm:w-64 h-40 overflow-hidden rounded-xl ">
              <a href={`/details/${villa?.listing_id}`}>
                <img
                  src={villa?.coverImage}
                  alt="Villa"
                  className="w-full h-full object-cover rounded-xl"
                />
              </a>
            </div>
          </div>




          {/* Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 my-4">
            <div>
              <h3 className="font-bold text-gray-800">Check-in</h3>

              <span>
                <p className="text-gray-600">
                  {booking?.checkinDate
                    ? new Date(booking.checkinDate).toDateString()
                    : "Check-in Date Not Available"}
                </p>
              </span>
              <p className="text-gray-600">
                {booking?.checkInTime || "12:00 PM"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Check-out</h3>
              <p className="text-gray-600">
                {booking?.checkoutDate
                  ? new Date(booking.checkoutDate).toDateString()
                  : "Check-out Date Not Available"}
              </p>

              <p className="text-gray-600">
                {booking?.checkoutTime || "10:00 AM"}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Guests</h3>
              <p className="text-gray-600">{booking?.adults || "5 Adults"}</p>
            </div>
          </div>

          {/* Room and Meal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-bold text-gray-800">Rooms</h3>
              <p className="text-gray-600">
                {villa?.numberOfBedrooms} Rooms
              </p>
              <p className="text-red-500 text-sm">
                Cancellation charges applicable as per policy.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Meals</h3>
              <p className="text-gray-600">
                {booking?.mealPlan || "No Meals included"}
              </p>
            </div>
          </div>


          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Important Information</h3>
            <ul className="text-gray-600 text-sm mt-2 list-disc pl-5">
              <li>
                For Accommodation charges GST invoice, please contact the hotel directly at {owner.phone_number}.
              </li>
              <li>
                Convenience fees GST invoice (if applicable) will be sent to you by Bnb India within 7 days of check-out.
              </li>
              <li>
                For Booking & Cancellation Policy details,{" "}
                <span
                  className="text-xs text-gray-400 font-semibold cursor-pointer pl-1"
                  onClick={() => setIsPopupOpen(true)}
                >
                  Click here
                </span>
              </li>
            </ul>
          </div>


          {/* Guest Info */}
          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            {/* <h3 className="text-lg font-bold mb-4">
              1 Room for {booking?.adults|| "5 Guests"}
            </h3> */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <div>
                <h4 className="font-bold">
                  {" "}
                  Adults: {booking?.adults || "NA"}
                </h4>
                <p>Total Guests: {booking?.adults || "NA"}</p>
                <h4 className="font-bold mt-4">Guest Email Id</h4>
                <p>{user?.email_id || "Email not found"}</p>
              </div>
              <div>
                <h4 className="font-bold">Guest Phone No</h4>
                <p>{user?.phone_number || "NA"}</p>
              </div>
              <div>
                <h4 className="font-bold">Primary Guest</h4>
                <p>
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ""}`.trim()
                    : "NA"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className=" max-h-[25vh] flex  justify-around flex-col  ">
          {/* Pricing Breakup */}
          <div className="p-3 h-auto mb-3 bg-white border rounded-md  ">
            <h3 className="text-lg font-bold">Pricing Breakup</h3>
            {/* {transaction?.map((txn: any, index: number) => (
              <div key={index} className="flex justify-between mt-2 text-gray-700">
                <span>{txn.description || "Reservation Charges"}</span>
                <span className="font-medium">₹ {txn.amount || "0.00"}</span>
              </div>
            ))} */}
            <div className="flex justify-between mt-1 text-gray-700">
              <span>{"Reservation Charges"}</span>
              <span className="font-medium">₹ {formatNumberWithCommas(booking?.totalPrice - booking?.serviceFee) || "0.00"}</span>
            </div>
            <div className="flex justify-between mt-2 text-gray-700">
              <span>{"Service Charges"}</span>
              <span className="font-medium">₹ {formatNumberWithCommas(booking.serviceFee) || "0.00"}</span>            </div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2 text-gray-900">
              <span>Total Price</span>
              <span>₹ {formatNumberWithCommas(booking?.totalPrice) || "NA"}</span>
            </div>
            {/* {booking?.transactionID && ( */}
            <div className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Payment ID:</span> {booking?.transactionID || "Not Available"}
            </div>
            {/* )} */}
          </div>

          <div className="p-3 border rounded-md shadow-md w-full max-w-sm bg-white">
            <h3 className="text-base font-semibold text-gray-800 mb-3">Booking Details</h3>
            <div className="flex flex-col gap-2">
              {/* Booking Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Booking Status:</span>
                <span className={`px-2 py-1 rounded-md font-medium ${statusLabels[booking?.status]?.color || defaultStatus.color}`}>
                  {statusLabels[booking?.status]?.label || defaultStatus.label}
                </span>
              </div>

              {/* Transaction Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">Transaction Status:</span>
                <span className={`px-2 py-1 rounded-md font-medium ${statusLabels[transaction[0]?.payment_status]?.color || defaultStatus.color}`}>
                  {statusLabels[transaction[0]?.payment_status]?.label || defaultStatus.label}
                </span>
              </div>
            </div>
          </div>

        </section>






      </div>
    </div>
  );
};

export default ViewAndManage;
