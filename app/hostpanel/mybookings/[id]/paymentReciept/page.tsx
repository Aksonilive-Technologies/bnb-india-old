"use client"
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {getreciptData } from '@/actions/booking/booking.action';
import { useParams } from 'next/navigation';
import { differenceInDays, format } from 'date-fns';



// Invoice compon{ent
const Invoice = () => {
  const params = useParams()
  const { id } = params;
  // const router = useRouter();
  const [villaData, setVillaData] = useState<any>();
  const [villaOwner, setVillaOwner] = useState<any>();
  const [bookingDetails, setBookingDetails] = useState<any>();
  const [transaction, seTransaction] = useState<any>();
  const [customer, setCustomer] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>();
  const componentRef = useRef(null);
  const getVillaData = async () => {
    setLoading(true);
    const response: any = await getreciptData(id);

    if (response.success) {
      setBookingDetails(response.data.booking);
      setVillaOwner(response.data.owner);
      setCustomer(response.data.user);
      setVillaData(response.data.villa);
      seTransaction(response.data.transaction);
      console.log(response)
      setLoading(false);

      console.log("componentRef 1 :", componentRef);
    } else { setError(response.error || "Failed to fetch data") }

    // await handleDownload();

  }

  // const total = calculateTotal(receiptData.items, receiptData.fees);


  const checkinDate = new Date(bookingDetails?.checkinDate);
  const checkoutDate = new Date(bookingDetails?.checkoutDate);

  const totalNights = differenceInDays(checkoutDate, checkinDate);
  const handleDownload = async () => {
    const input = componentRef.current;

    if (!input) {
      console.error("No input found! Ensure the ref is correctly attached to a DOM element.");
      return;
    }

    try {
      // Capture the content using html2canvas with higher scale for better resolution
      const canvas = await html2canvas(input, {
        scale: 4, // Increase scale for higher resolution
        useCORS: true, // Handle cross-origin images if any
      });

      const imgData = canvas.toDataURL("image/png");

      // Create a new jsPDF instance
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions while maintaining aspect ratio
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Add content to the PDF, handling multi-page content
      let y = 0;
      while (y < imgHeight) {
        pdf.addImage(imgData, "PNG", 0, y > 0 ? -y : 0, imgWidth, imgHeight);
        y += pdfHeight;

        if (y < imgHeight) pdf.addPage(); // Add a new page if content overflows
      }

      // Save the PDF
      pdf.save(`Invoice_${new Date().toISOString()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };





  useEffect(() => {
    if (!loading && bookingDetails && villaOwner && customer && villaData && transaction) {
      handleDownload();
    }
  }, [loading, bookingDetails, villaOwner, customer, villaData, transaction]);

  useEffect(() => {
    getVillaData();
  }, []);
  if (error) {
    return <div className="min-h-[70vh] flex items-center justify-center">Error: {error}</div>
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {
        loading ? (
          <div className="flex w-full min-h-[80vh] items-center justify-center mb-4">
            <div className="flex flex-col justify-center h-full w-full items-center space-x-2">
              <div className="loader w-8 h-8 mb-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin sm:w-5 sm:h-5 sm:border-2"></div>
              <span className="text-gray-600 font-semibold sm:text-sm text-xl sm:font-medium">
                Generating the Receipt for you...
              </span>
            </div>
          </div>
        ) : (
          <div
            ref={componentRef}
            className="relative p-4 sm:p-6 w-full max-w-3xl mx-auto border border-gray-300 bg-white shadow-lg rounded-lg "
          >
            {/* Background Logo */}
            <div className="absolute inset-0 flex justify-center items-center print:hidden">
              <div className="relative w-24 h-16 sm:w-32 sm:h-20">
                <Image
                  src="/logo.png"
                  alt="Company Logo"
                  width={80}
                  height={80}
                  className="object-contain w-full h-full opacity-5"
                />
              </div>
            </div>

            {/* Header */}
            <div className="relative z-10 flex flex-row justify-between items-start sm:items-center mb-6">
              <div className="text-sm sm:text-base">
                <h3 className="text-lg font-bold text-gray-900">Hotel Info:</h3>
                <p className="text-gray-700">Hotel: {villaData?.title}</p>
                <p className="text-gray-700 max-w-[300px] sm:max-w-[400px]">Address: {villaData?.address}</p>
                <p className="text-gray-700">{villaData?.city}, {villaData?.state}</p>
                <p className="text-gray-700">Email: {villaOwner?.email_id}</p>
                <p className="text-gray-700">Phone: {villaOwner.phone_number}</p>
              </div>
              <div className="flex flex-col items-center mt-4 sm:mt-0">
                <Image
                  src="/logo.png"
                  alt="BnbIndia Logo"
                  width={20}
                  height={20}
                  className="opacity-50"
                />
                <span className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
                  BnbIndia
                </span>
                <p className="text-gray-700 text-xs sm:text-sm">admin@bnbindia.co.in</p>
                <p className="text-gray-700 text-xs sm:text-sm">+91 9136921160</p>
              </div>
            </div>

            {/* Invoice and Date */}
            <div className="bg-gray-200 p-2 sm:p-3 rounded mb-6 flex flex-row justify-between text-[11px]">
              <span className="font-semibold">
                Invoice No. {transaction[0]?.payment_id}
              </span>
              <span className="font-semibold">
                Booking Date: {new Date(bookingDetails.createdAt).toDateString()}
              </span>
            </div>

            {/* Bill To */}
            <div className="relative z-10 border-t border-gray-300 pt-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900">Bill to:</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                Name: {customer.first_name + " " + customer.last_name}
              </p>
              <p className="text-gray-700 text-sm sm:text-base">Mobile: {customer.phone_number}</p>
              <p className="text-gray-700 text-sm sm:text-base">
                Check-in Date: {format(new Date(bookingDetails.checkinDate), "dd MMM yyyy")}
              </p>
              <p className="text-gray-700 text-sm sm:text-base">
                Check-Out Date: {format(new Date(bookingDetails.checkoutDate), "dd MMM yyyy")}
              </p>
            </div>

            {/* Table */}
            <table className="relative z-10 w-full text-left mb-6 text-sm ">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4 text-gray-900">Description</th>
                  <th className="py-2 px-4 text-gray-900"># Nights</th>
                  <th className="py-2 px-4 text-gray-900">Price per Night</th>
                  <th className="py-2 px-4 text-gray-900">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="py-2 px-4 text-gray-700">
                    Stay at {villaData.title}
                  </td>
                  <td className="py-2 px-4 text-gray-700">{totalNights}</td>
                  <td className="py-2 px-4 text-gray-700">
                    ₹{transaction[0].payment_amount / totalNights}
                  </td>
                  <td className="py-2 px-4 text-gray-700">
                    ₹{transaction[0].payment_amount}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Total */}
            <div className="relative z-10 border-t border-gray-300 pt-4">
              <div className="flex justify-between font-bold text-lg sm:text-xl text-gray-900">
                <span>Total</span>
                <span>₹{transaction[0]?.payment_amount}</span>
              </div>
            </div>

            {/* Thank You */}
            <div className="relative z-10 mt-6 flex justify-center">
              <p className="text-gray-900 font-bold text-xl sm:text-2xl font-serif text-center">
                Thank you for your business!
              </p>
            </div>
          </div>
        )
      }
    </div>


  );
};

export default Invoice;


{/* <div

  className=" flex items-center justify-center w-full red-gradient h-[40px] rounded-lg text-white font-bold hover:to-blue-100 z-50 mt-3"
>

  <Link href="/details/cm0j5azs40000sd3503ultwfi/bookingconfirmation/paymentReciept" target="_blank">
    <button>Download Invoice</button>
  </Link>


</div> */}