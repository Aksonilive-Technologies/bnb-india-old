

'use client'

import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script';
import toast from 'react-hot-toast';
import { getListingById } from '@/actions/listing/listing.action';
import { useUserStore } from '@/store/store';
import ImageWithFallBack from '@/components/shared/ImageFallback';
import DynamicHead from "@/components/DynamicHead";
import PhoneNumberPopup from '@/components/shared/phonePopUp';
import { calculateDaysDifference, fetchPrice, formatNumberWithCommas, initializePayment } from '../paymentUtils/utils';
import { BookingConfirmationSkeletonLoader } from '@/components/skeleton/bookingConfirmationLoader';

declare global {
  interface Window {
    Razorpay: any;
  }
}
const CUSTOM_SERVER_URL = process.env.NEXT_PUBLIC_CUSTOM_WEBHOOK_SERVER_URL

type ServiceType = 'chef' | 'staffService' | 'cleaning';

export default function ConfirmReservation({ params, searchParams }: any) {
  const id = params.id;
  const [villaData, setVillaData] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [services, setServices] = useState({
    chef: false,
    staffService: false,
    cleaning: false,
  });
  const [detailsFetch, setDetailsFetch] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const handleServiceChange = (service: ServiceType) => {
    setServices((prevServices) => ({
      ...prevServices,
      [service]: !prevServices[service],
    }));
  };
  const router = useRouter();

  const [bookingDetails, setBookingDetails] = useState<any>();
  const formatDateString = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {

      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };



  const url = useSearchParams();

  const fetchData = async () => {
    try {
      setLoading(true);

      const Listingdata: any = await getListingById(id);
      if (Listingdata) {
        console.log("User is: ", user);
        console.log("Listing data: ", Listingdata);
        setVillaData(Listingdata[0]);
      } else {
        toast.error("Something went wrong! Redirecting back to villa details page...");
        router.back();
        return;
      }

      console.log("Fetching booking details from URL...");
      console.log(params);
      console.log(searchParams);

      const checkInDate = url.get("checkInDate");
      const checkOutDate = url.get("checkOutDate");
      const adults = url.get("adultCount") || 1;
      const children = url.get("childrenCount") || 0;
      const pets = url.get("petsCount") || 0;
      console.log("DETAILS ARE ", { checkInDate, checkOutDate, adults, children, pets });

      if (checkInDate && checkOutDate) {
        const parsedBookingDetails = {
          checkinDate: new Date(checkInDate),
          checkoutDate: new Date(checkOutDate),
          adults: Number(adults),
          children: Number(children),
          pets: Number(pets),
          propertyId: id
        };
        console.log(parsedBookingDetails);

        setBookingDetails(parsedBookingDetails);

        const { roomPrice, extraPrice, serviceFee } = await fetchPrice(parsedBookingDetails, Listingdata);

        setPrice(roomPrice);
        setExtraGuestPrice(extraPrice);
        setServiceFee(serviceFee);
        setDetailsFetch(true);
      } else {
        toast.error("Booking details not found in URL!  Redirecting back to villa details page...");
        return;
      }
    } catch (error) {
      console.error("Error during data fetching or price calculation:", error);
      toast.error("An error occurred! Redirecting back to villa details page...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const serviceCosts = {
    chef: 200,
    staffService: 150,
    cleaning: 100,
  };




  const [isProcessing, setIsProcessing] = useState(false);
  const [phonePopup, setPhonePopup] = useState(false);

  const [price, setPrice] = useState(0);
  const [extraGuestPrice, setExtraGuestPrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);




  return (

    <div className="min-h-screen md:max-h-5xl h-full md:max-w-7xl md:mx-auto  py-4 sm:px-6  lg:px-8">
      <DynamicHead title={`${villaData?.title || ''} | booking confirmation`} />
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />


      {
        phonePopup && <PhoneNumberPopup setPhonePopup={setPhonePopup} />
      }

      <div className='w-auto bg-white p-[12px] rounded-md  '>

        {/* header */}
        <div className='pl-[10px]   md:h-[10vh] w-full md:w-[40%]   flex gap-[20px] flex-row items-center '>

          <FaArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
          />

          <p className='font-bold text-[15px] md:text-[25px]'> Confirm And Pay</p>
        </div>
        {
          !loading && detailsFetch ?
            <>
              <div className=' flex flex-col md:flex-row items-start h-auto justify-between  md:px-[20px] '>

                {/* left */}
                <div className='h-auto md:w-[50%] mt-[5vh]'>
                  {/* Trip Summary Section */}
                  <div className='border-b-[1px] border-gray-200 pb-4'>

                    <div className='flex  items-end flex-row justify-between space-x-4'>
                      <p className="font-bold text-xl pb-1 text-left text-gray-900">Your Trip Summary</p>
                      <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-[120px] red-gradient h-[30px] rounded-md text-white text-[12px] font-bold hover:to-blue-100 z-50"
                      >
                        Edit Booking
                      </button>

                    </div>

                    {/* Booked By Section */}


                    {/* Dates Section */}
                    <div className='flex mt-3 px-[5%] w-full flex-col'>
                      <div className='flex flex-row justify-between items-center'>
                        <p className='text-[16px] font-semibold'>Dates</p>
                        <p className='text-[13px] font-bold'>
                          {formatDateString(bookingDetails?.checkinDate)} to {formatDateString(bookingDetails?.checkoutDate)}
                        </p>
                      </div>
                    </div>

                    {/* Guest Section */}
                    <div className='flex mt-1 px-[5%] w-full flex-col'>
                      <div className='flex flex-row justify-between items-center'>
                        <p className='text-[16px] font-semibold'>Guest</p>
                        <p className='text-[14px] font-bold'>
                          {bookingDetails?.pets + bookingDetails?.children + bookingDetails?.adults} Guest
                          ({bookingDetails?.adults} Adults {bookingDetails?.children != 0 ? `+ ${bookingDetails?.children} Children` : null} {bookingDetails?.pets != 0 ? `+ ${bookingDetails?.pets} Pets` : null})
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}

                  </div>

                  {/* Cancellation Policy Section */}
                  <div className='border-b-[1px] border-gray-200 pb-4 mt-4'>
                    <p className="font-bold text-lg text-left text-gray-900">Cancellation Policy</p>
                    <p className='text-sm px-[10px]'>
                      <span className='font-bold'>Free cancellation policy:</span> Cancellations made up to
                      {villaData?.cancellationType === "FIRM" && " 30 days "}
                      {villaData?.cancellationType === "FLEXIBLE" && " 15 days "}
                      {villaData?.cancellationType === "RELAXED" && " 7 days "}
                      {/* {!villaData?.cancellationType && " [Number of days not specified] "} */}
                      before the joining date are free of charge.
                    </p>
                  </div>

                  {/* // FIRM = 30 days, FLEXIBLE = 15 days, Relaxed = 7 days */}

                  {/* Ground Rules Section */}
                  <div className='border-b-[1px] border-gray-200 pb-4 mt-4'>
                    <p className="font-bold text-lg text-left text-gray-900">Ground Rules</p>
                    <p className='text-sm px-[10px]'>We expect everyone to follow some rules, i.e.:</p>
                    <ul className='list-disc pl-[30px]'>
                      <li className='text-[13px]'>Follow the house rules</li>
                      <li className='text-[13px]'>Treat your room like your own</li>
                    </ul>
                  </div>

                  {/* Host Confirmation Section */}
                  <div className='border-b-[1px] border-gray-200 pb-4 mt-4'>
                    <p className='text-sm px-[10px]'>
                      <span className='font-bold'>The Host will need to accept this request:</span> You'll pay now, but will get a full refund if your reservation isn't confirmed within 24 hours.
                    </p>
                  </div>

                  <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className='flex items-center justify-between w-full mb-3'>
                      <p className="text-lg font-semibold text-gray-800 ">Booked By</p>
                      <button
                        onClick={() => {
                          // Add functionality to update user details
                          setPhonePopup(true); // Example: Open a popup to update details
                        }}
                        className="flex items-center justify-center w-[80px] red-gradient h-[30px] rounded-sm text-white text-sm font-semibold hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg"
                      >

                        Edit
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Name:</span>
                        <span className="text-sm font-bold text-gray-800">{user?.first_name + " " + user?.last_name || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Email:</span>
                        <span className="text-sm font-bold text-gray-800">{user?.email_id || "N/A"}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-600 w-24">Phone:</span>
                        <span className="text-sm font-bold text-gray-800">{user?.phone_number || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  {/* Agreement Section */}

                  <div className="flex items-start px-4 mt-4 space-x-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id="agreement"
                        checked={isAgreed}
                        onChange={() => setIsAgreed(!isAgreed)}
                        className="mt-1 h-5 w-5 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                      />
                      <div className="text-sm text-gray-700">
                        By clicking the button below, I confirm my agreement to the
                        <span className="font-semibold underline text-blue-600 hover:text-blue-800">
                          <Link href="/GroundRules"> Ground Rules </Link>
                        </span>,
                        <span className="font-semibold underline text-blue-600 hover:text-blue-800">
                          <Link href="/PrivacyPolicy"> Privacy Policy </Link>
                        </span>,
                        and
                        <span className="font-semibold underline text-blue-600 hover:text-blue-800">
                          <Link href="/TermsOfService"> Terms of Service </Link>
                        </span>.
                        I understand that Host may charge additional fees if I cause any damages.
                      </div>
                    </label>
                  </div>
                </div>


                {/* card part  */}
                <div className="w-full mt-3 z-[1]   md:w-[35%]  h-auto  ">
                  <div className="border-[1px] rounded-xl border-gray-400 flex items-center justify-center flex-col p-4 bg-white shadow-lg">
                    <div className="w-full h-56 xl:h-52  rounded-xl   overflow-hidden ">
                      <ImageWithFallBack url={villaData?.coverImage} />
                    </div>

                    <div className="py-2 w-full border-b-[1px] border-gray-300">
                      <p className="font-bold text-lg text-left text-gray-900">
                        {villaData?.title}
                      </p>
                      <div className='flex items-center justify-between'>
                        <p className="font-semibold text-sm text-left text-gray-700">
                          {` ${villaData.city}, ${villaData.state}`}
                        </p>
                        <div className="flex items-center  ">
                        </div>
                      </div>


                    </div>
                    <div className="w-full flex flex-col items-start py-2">
                      <p className="font-bold text-lg text-left text-gray-900">Price Details</p>
                      <div className="flex text-sm px-2 w-full justify-between items-center text-gray-900 font-semibold">
                        <p>₹{price / calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} x {calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} night</p>
                        <p>₹{formatNumberWithCommas(price)}</p>
                      </div>
                      {
                        extraGuestPrice > 0 &&
                        <div className="flex text-sm px-2 w-full justify-between items-center text-gray-900 font-semibold">
                          <p>₹{villaData?.pricePerGuest} x {calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} night x {bookingDetails?.adults - villaData.maxGuests} extra Guest </p>
                          <p>₹{formatNumberWithCommas(extraGuestPrice)}</p>
                        </div>
                      }


                      {
                        services.chef &&
                        <div className="flex text-sm mt-1 px-2 w-full justify-between items-center text-gray-700">
                          <p className=''>
                            Addtional Chef
                          </p>
                          <p>₹{serviceCosts.chef}</p>
                        </div>
                      }
                      {
                        services.staffService &&
                        <div className="flex text-sm px-2 w-full justify-between items-center text-gray-700">
                          <p className=''>Staff Service</p>
                          <p>₹{serviceCosts.staffService}</p>
                        </div>
                      }
                      {
                        services.cleaning &&
                        <div className="flex text-sm px-2 w-full justify-between items-center text-gray-700">
                          <p className=''>cleaning Tax</p>
                          <p>₹{serviceCosts.cleaning}</p>
                        </div>
                      }

                      <div className="flex text-sm px-2 w-full justify-between items-center text-gray-900 font-semibold">
                        <p>Service Fee </p>
                        <p>₹{formatNumberWithCommas(serviceFee)}</p>
                      </div>
                      <div className="flex text-lg font-bold text-gray-900 px-2 mt-2 pt-2 w-full border-t-[1px] border-gray-300 justify-between items-cente">
                        <p className="text-left">Total</p>
                        <p>₹{formatNumberWithCommas(extraGuestPrice + price + serviceFee)}</p>
                      </div>

                    </div>

                    <button
                      onClick={async () => {
                        await initializePayment(
                          user,
                          villaData,
                          id,
                          bookingDetails,
                          isAgreed,
                          price,
                          extraGuestPrice,
                          serviceFee,
                          setIsProcessing,
                          setPhonePopup,
                          router
                        );
                      }}
                      disabled={isProcessing}
                      className="relative flex items-center justify-center w-full red-gradient h-[40px] rounded-lg text-white font-bold hover:to-blue-100 z-50"
                    >
                      {isProcessing ? 'Processing payment' : 'Pay Now'}
                    </button>
                  </div>



                </div>

              </div>

            </>

            : <BookingConfirmationSkeletonLoader />
        }



      </div>
    </div >
  );
};



