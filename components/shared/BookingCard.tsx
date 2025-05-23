
"use client";

import { useRouter } from "next/navigation";
import { FaBuilding } from "react-icons/fa";

export const BookingCard = (d: any) => {
    const router = useRouter();
    const calculateNights = (startDate: Date, endDate: Date) => {
        const diffTime = Math.abs(endDate?.getTime() - startDate?.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };
    return (

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
    )
}