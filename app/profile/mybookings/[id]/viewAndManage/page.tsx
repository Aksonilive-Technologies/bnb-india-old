"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getreciptData } from "@/actions/booking/booking.action";
import { cancelBooking } from "@/actions/payment/payment.action";
import toast from "react-hot-toast";

import BookingCancellationPolicy from "@/components/shared/bookingCancellationPolicy";
import ImageWithFallBack from "@/components/shared/ImageFallback";
import { formatNumberWithCommas } from "@/app/details/[id]/paymentUtils/utils";

// Adjust the path as necessary
const statusLabels: any = {
  pending: { label: "🔄 Pending", color: "bg-yellow-100 text-yellow-700" },
  Pending: { label: "🔄 Pending", color: "bg-yellow-100 text-yellow-700" },
  cancellationInProgress: {
    label: "⏳ Processing Cancellation",
    color: "bg-orange-100 text-orange-700",
  },
  refundProcessing: {
    label: "🔁 Refund in Process",
    color: "bg-blue-100 text-blue-700",
  },
  refundProcessed: {
    label: "✅ Refunded",
    color: "bg-green-100 text-green-700",
  },
  refundFailed: { label: "❌ Refund Failed", color: "bg-red-100 text-red-700" },
  failed: { label: "❌ Payment Failed", color: "bg-red-100 text-red-700" },
  completed: {
    label: "🎉 Payment Completed",
    color: "bg-green-100 text-green-700",
  },
  confirmed: { label: "📦 Confirmed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "🚫 Cancelled", color: "bg-red-100 text-red-700" },
  processing: {
    label: "⏳ Processing",
    color: "bg-orange-100 text-orange-700",
  },
  onHold: { label: "⏸️ On Hold", color: "bg-gray-100 text-gray-700" },
  noRefund: {
    label: "🚫 Refund Not Eligible",
    color: "bg-gray-100 text-gray-700",
  },
};

const defaultStatus: any = {
  label: "Not Found",
  color: "bg-gray-100 text-gray-700",
};

const BookingDetails = () => {
  const params = useParams();
  const { id }: any = params;
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [error, setError] = useState("");
  const fetchBookingData = async () => {
    try {
      const response: any = await getreciptData(id);

      if (response.success) {
        setBookingData(response?.data);
        console.log(response.data);
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

  function confirmPopup(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const container = document.createElement("div");
      container.className =
        "fixed inset-0 flex items-center justify-center bg-black bg-opacity-50";

      const popup = document.createElement("div");
      popup.className = "bg-white p-6 rounded-lg shadow-lg max-w-md w-full";

      const text = document.createElement("h2");
      text.className = "text-lg font-semibold text-gray-900";
      text.textContent = message;

      const buttonContainer = document.createElement("div");
      buttonContainer.className = "flex justify-end gap-3 mt-4";

      const cancelButton = document.createElement("button");
      cancelButton.className =
        "px-4 py-2 border rounded text-gray-600 border-gray-300 hover:bg-black hover:text-white";
      cancelButton.textContent = "No";
      cancelButton.onclick = () => {
        document.body.removeChild(container);
        resolve(false);
      };

      const confirmButton = document.createElement("button");
      confirmButton.className = "px-4 py-2 red-gradient text-white rounded";
      confirmButton.textContent = "Yes, continue with cancellation";
      confirmButton.onclick = () => {
        document.body.removeChild(container);
        resolve(true);
      };

      buttonContainer.appendChild(cancelButton);
      buttonContainer.appendChild(confirmButton);
      popup.appendChild(text);
      popup.appendChild(buttonContainer);
      container.appendChild(popup);
      document.body.appendChild(container);
    });
  }

  const [cancel, setCancel] = useState(false);
  const handleCancelBooking = async (Bookingid: string) => {
    if (cancel) return;
    try {
      const confirmation = await confirmPopup(
        "Are you sure you want to cancel this booking?",
      );
      if (!confirmation) return;
      setCancel(true);
      const response = await cancelBooking(
        Bookingid,
        booking?.transactionID,
        booking?.totalPrice,
        true,
      );

      if (response.success) {
        const result = response.result;
        console.log("Booking canceled:", result);
        toast.success("Booking successfully canceled.");
        setTimeout(() => {
          toast.success(
            "Your refund will be processed within the next 48 hours.",
          );
        }, 3214);

        // Optionally, refresh data or update state

        fetchBookingData(); // Call your fetch function to reload bookings
      } else {
        console.error("Failed to cancel booking:", response.error);
        toast.error("Failed to cancel booking. Please try again.");
      }
      setCancel(false);
    } catch (error) {
      console.error("Error canceling booking:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        Error: {error}
      </div>
    );

  const { booking, villa, transaction, owner, user, addreviewflag }: any =
    bookingData || {};

  console.log("The data in front end", addreviewflag);
  console.log("The data in front end flag", addreviewflag[0].addreviewflag);

  return (
    <div className="bg-gray-50 p-6">
      {/* Header Section */}
      <header className="bg-gray-800 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">Booking Completed</h1>
        <p className="text-sm">
          You have completed your booking. We hope you had a pleasant stay!
        </p>
      </header>
      {isPopupOpen && (
        <BookingCancellationPolicy
          setIsPopupOpen={setIsPopupOpen}
          cancellationType={villa.cancellationType}
        />
      )}

      <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {/* Left Section */}

        <section className="md:col-span-2 bg-white rounded-lg shadow-lg p-6 md:p-12 ">
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
                📍 {villa?.address}, {villa?.area_name}, {villa?.city},{" "}
                {villa?.state}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
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
              <p className="text-gray-600">{villa?.numberOfBedrooms} Rooms</p>
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

          {/* Important Info */}
          <div className="mt-6">
            <h3 className="font-bold text-gray-800">Important Information</h3>
            <ul className="text-gray-600 text-sm mt-2 list-disc pl-5">
              <li>
                For Accommodation charges GST invoice, please contact the hotel
                directly at {owner.phone_number}.
              </li>
              <li>
                Convenience fees GST invoice (if applicable) will be sent to you
                by Bnb India within 7 days of check-out.
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

        <section className=" max-h-[50vh] mb-[10vh] flex  justify-around flex-col  ">
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
              <span className="font-medium">
                ₹{" "}
                {formatNumberWithCommas(
                  booking?.totalPrice - booking?.serviceFee,
                ) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between mt-2 text-gray-700">
              <span>{"Service Charges"}</span>
              <span className="font-medium">
                ₹ {formatNumberWithCommas(booking.serviceFee) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t mt-2 pt-2 text-gray-900">
              <span>Total Price</span>
              <span>
                ₹ {formatNumberWithCommas(booking?.totalPrice) || "NA"}
              </span>
            </div>
            {/* {booking?.transactionID && ( */}
            <div className="mt-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Payment ID:</span>{" "}
              {booking?.transactionID || "Not Available"}
            </div>
            {/* )} */}
          </div>

          {/* Payment Info */}
          {/* <div className="mb-6">
            <h3 className="text-lg font-bold">Paid</h3>
            <div className="flex justify-between mt-2">
              <span>{booking?.paymentMethod || "okhdfcbank (****bank)"}</span>
              <span>₹ {booking?.paidAmount || "3,645"}</span>
            </div>
          </div> */}
          <div className="p-3 mb-[20px] border rounded-md shadow-md w-full max-w-sm bg-white">
            <h3 className="text-base font-semibold text-gray-800 mb-3">
              Booking Details
            </h3>
            <div className="flex flex-col gap-2">
              {/* Booking Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Booking Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-md font-medium ${statusLabels[booking?.status]?.color || defaultStatus.color}`}
                >
                  {statusLabels[booking?.status]?.label || defaultStatus.label}
                </span>
              </div>

              {/* Transaction Status */}
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">
                  Transaction Status:
                </span>
                <span
                  className={`px-2 py-1 rounded-md font-medium ${statusLabels[transaction[0]?.payment_status]?.color || defaultStatus.color}`}
                >
                  {statusLabels[transaction[0]?.payment_status]?.label ||
                    defaultStatus.label}
                </span>
              </div>
              <div className="text-sm text-gray-700 text-center mt-4 p-2 bg-gray-100 rounded-lg">
                If you have any questions, feel free to contact
                <span>
                  <Link
                    className="font-semibold text-blue-600  cursor-pointer hover:underline"
                    href={"/helpandsupport"}
                  >
                    {" "}
                    BnBIndia{" "}
                  </Link>
                </span>
                for assistance.
              </div>
              {/* <p>For any querry please contact bnb Help</p> */}
            </div>
          </div>
          {/* Ticket & Invoice */}

          <div className="flex flex-col gap-3 text-center w-full">
            <button className="w-full px-4 py-2 red-gradient text-white text-sm font-semibold rounded-lg shadow-lg transition duration-300  hover:shadow-md">
              <a
                href={`/profile/mybookings/${id}/paymentReciept`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-[48%] text-center px-6 py-2 red-gradient text-white rounded-lg  font-semibold transition duration-300"
              >
                Download Invoice
              </a>
            </button>

            {transaction[0]?.payment_status === "confirmed" &&
              addreviewflag[0].addreviewflag === "False" && (
                <button
                  onClick={async () => {
                    setCancel(true);
                    await handleCancelBooking(id);
                    setCancel(false);
                  }}
                  className="w-full px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg transition duration-300 hover:bg-gray-600 hover:shadow-md flex justify-center items-center"
                  disabled={cancel}
                >
                  {cancel ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 mr-2 border-t-2 border-white border-solid rounded-full"
                        viewBox="0 0 24 24"
                      ></svg>
                      Canceling...
                    </>
                  ) : (
                    "Cancel Booking"
                  )}
                </button>
              )}

            {addreviewflag[0].addreviewflag === "True" && (
              <Link
                href={`/add-review/?villaId=${villa?.listing_id}&bookingId=${id}`}
                className="w-full px-4 py-2  bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg transition duration-300 hover:bg-grey-600 hover:shadow-md"
              >
                Review Property
              </Link>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookingDetails;
