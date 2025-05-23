

'use client'

import { FaStar } from "react-icons/fa";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { getListingById } from '@/actions/listing/listing.action';
import { fetchBookingByID } from '@/actions/booking/booking.action';
import toast from 'react-hot-toast';
import ImageWithFallBack from '@/components/shared/ImageFallback';


// type ServiceType = 'chef' | 'staffService' | 'cleaning';

const BookingData = ({ params }: any) => {
  const { id } = params;
  console.log(id);




  // const pathname = usePathname()
  const router = useRouter();
  const [villaData, setVillaData] = useState<any>();
  const [bookingDetails, setBookingDetails] = useState<any>();
  const [loading, setLoading] = useState(true);
  const getVillaData = async () => {
    setLoading(true);
    const response: any = await fetchBookingByID(id);
    console.log(response)
    if (response.success) {
      console.log("Booking details:", response.booking);
      setBookingDetails(response.booking);
      const Listingdata: any = await getListingById(response.booking.propertyId);
      if (Listingdata) {
        console.log("Listing data: ", Listingdata);
        setVillaData(Listingdata[0]);

      } else {
        toast.error("Something Went wrong! Redirecting back to villa details page...");
        router.back();
      }
    } else {
      console.error("Error:", response.error);
    }




    setLoading(false);
  }
  useEffect(() => { getVillaData() }, [])
  const formatDateString = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {

      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  function calculateDaysDifference(checkinDate: any, checkoutDate: any) {
    // Parse the dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Calculate the difference in time (milliseconds)
    const timeDifference = checkout.getTime() - checkin.getTime();

    // Convert milliseconds to days
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);

    return Math.ceil(daysDifference); // Round up to ensure full days are counted
  }
  return (
    <div className="min-h-screen h-full w-full  py-12 sm:px-6  lg:px-8">

      <div className='w-auto bg-white p-[15px] md:p-[30px] rounded-md  md:mx-[8vw]'>
        {
          loading ? <p>Loading...</p> :
            <div className=' flex flex-col md:flex-row items-start h-auto justify-between  md:px-[20px] '>

              {/* left */}
              <div className=' h-auto md:w-[50%] md:mt-[5vh] '>
                <div className='border-b-[1px] border-gray-200 pb-4 '>
                  <p className="font-bold text-xl pb-1 border-greu-200 text-left text-gray-900">Your trip Summary</p>


                  <div className='flex  mt-1   px-[5%] w-full felx flex-col'>
                    <div className='flex  flex-row justify-between items-center'>
                      <p className='text-[16px] font-semibold'>
                        Dates
                      </p>
                      <p className='text-[13px] font-bold'>
                        {formatDateString(bookingDetails.checkinDate)} to {formatDateString(bookingDetails.checkoutDate)}   ({calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} nights)


                      </p>
                    </div>
                    {/* <p className='text-[13px] font-bold'>1 room</p> */}
                  </div>
                  <div className='flex mt-1  px-[5%] w-full felx flex-col'>
                    <div className='flex  flex-row justify-between items-center'>
                      <p className='text-[16px] font-semibold'>
                        Guest count
                      </p>
                      <p className='text-[14px] font-bold  '>
                        {bookingDetails.children} children, {bookingDetails.adults} adults
                      </p>
                    </div>
                    <div className='flex  flex-row justify-between items-center'>
                      <p className='text-[16px] font-semibold'>
                        Booking Id
                      </p>
                      <p className='text-[14px] font-bold  '>
                        {bookingDetails.id}
                      </p>
                    </div>
                    {/* <div className='flex  flex-row justify-between items-center'>
                      <p className='text-[16px] font-semibold'>
                        Payment Method
                      </p>
                      <p className='text-[14px] font-bold  '>
                        UPI
                      </p>
                    </div> */}
                    <div className='flex  flex-row justify-between items-center'>
                      <p className='text-[16px] font-semibold'>
                        Transaction Id
                      </p>
                      <p className='text-[14px] font-bold  '>
                        {bookingDetails.transactionID}
                      </p>
                    </div>

                  </div>
                </div>



                {/* <div className='border-b-[1px] border-gray-200  pb-4 mt-4'>
                    <p className="font-bold text-xl  pb-1 text-left text-gray-900">Additional Services Availed</p>

                    <div className='flex mt-3 px-[5%] w-full flex-col'>
                      <div className='flex flex-row justify-between items-center'>
                        <p className='text-[16px] font-semibold'>Personal Chef</p>
                      </div>
                      <p className="text-[12px] text-gray-400  ">Enjoy personalized culinary experiences with our private chef service.</p>
                    </div>

                    <div className='flex mt-1 px-[5%] w-full  flex-col'>
                      <div className='flex flex-row justify-between items-center'>
                        <p className='text-[16px] font-semibold'>Staff Services</p>
                      </div>
                      <p className="text-[12px] text-gray-400  ">Effortlessly elevate your stay with attentive staff service.</p>
                    </div>
                  </div> */}


                <div className='border-b-[1px] border-gray-200  pb-4 mt-4'>
                  <p className="font-bold text-lg 1 border-gray-200 text-left text-gray-900">Cancelation Policy</p>
                  <p className='text-sm  px-[10px]'>
                    <span className='font-bold'>
                      Free cancellation policy:
                    </span>
                    Cancellations made up to 24 hours before the joining date are free of charge.
                  </p>

                </div>


                <div className='border-b-[1px] border-gray-200 pb-4 mt-4'>
                  <p className="font-bold text-lg border-gray-200 text-left text-gray-900">Ground Rules</p>
                  <p className='text-sm px-[10px]'>
                    We expect everyone to follow some rules, i.e.:
                  </p>

                  <ul className='list-disc pl-[30px]'>
                    <li className='text-[13px]'>
                      Follow the house rules
                    </li>
                    <li className='text-[13px]'>
                      Treat your room like your own
                    </li>
                  </ul>
                </div>
                <div className='border-b-[1px] border-gray-200 pb-4 mt-4'>
                  <p className='text-sm px-[10px]'>
                    <span className='font-bold'>
                      The Host will need to accept this request-
                    </span>
                    {`You'll pay now, but will
                get a full refund if your reservation isn't confirmed within 24 hours.`}
                  </p>
                </div>

              </div>


              {/* card part  */}
              <div className="w-full mt-3    md:w-[35%]  h-auto md:sticky top-14">
                <div className="border-[1px] rounded-xl border-gray-400 flex items-center justify-center flex-col p-4 bg-white shadow-lg">
                  <div className="w-full h-56 xl:h-64 object-cover rounded-xl   overflow-hidden relative">
                    {/* <Image
                        alt="villa image"
                        src={villaData?.coverImage}
                        fill={true}
                        style={{ objectFit: 'cover' }}
                      /> */}

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
                        <FaStar className="size-3 mb-1" />
                        <p className="px-2 text-[15px] ">4.2</p>
                        {/* <Link href="#"> */}
                        <p className="text-[10px]">(22 reviews)</p>
                        {/* </Link> */}
                      </div>
                    </div>


                  </div>
                  <div className="w-full flex flex-col items-start py-2">
                    <p className="font-bold text-lg text-left text-gray-900">Price Details</p>
                    <div className="flex text-sm px-2 w-full justify-between items-center text-gray-900 font-semibold">
                      <p>₹{bookingDetails?.totalPrice / calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} x {calculateDaysDifference(bookingDetails?.checkinDate, bookingDetails?.checkoutDate)} Night </p>
                      <p>₹{bookingDetails?.totalPrice}</p>
                    </div>

                    {
                      bookingDetails?.services?.chef &&
                      <div className="flex text-sm mt-1 px-2 w-full justify-between items-center text-gray-700">
                        <p className=''>
                          Addtional Chef
                        </p>
                        <p>₹{bookingDetails?.services?.chef}</p>
                      </div>
                    }
                    {
                      bookingDetails?.services?.staffService &&
                      <div className="flex text-sm px-2 w-full justify-between items-center text-gray-700">
                        <p className=''>Staff Service</p>
                        <p>₹{bookingDetails?.serviceCosts.staffService}</p>
                      </div>
                    }
                    {
                      bookingDetails?.services?.cleaning &&
                      <div className="flex text-sm px-2 w-full justify-between items-center text-gray-700">
                        <p className=''>cleaning Tax</p>
                        <p>₹{bookingDetails?.serviceCosts.cleaning}</p>
                      </div>
                    }


                    <div className="flex text-lg font-bold text-gray-900 px-2 mt-2 pt-2 w-full border-t-[1px] border-gray-300 justify-between items-cente">
                      <p className="text-left">Total</p>
                      <p>₹{bookingDetails?.totalPrice}</p>
                    </div>
                  </div>

                  {/* <button onClick={handlePayment} disabled={isProcessing}

                className="relative flex items-center justify-center w-full red-gradient h-[40px] rounded-lg text-white font-bold hover:to-blue-100 z-50"
              >
                {isProcessing ? 'processing payment' : 'Pay Now'}
              </button> */}

                  {/* this button will be shifted to the bookings page in profile of user */}
                  <Link href={`/profile/mybookings/${id}/paymentReciept`} target="_blank" className=" flex items-center justify-center w-full red-gradient h-[40px] rounded-lg text-white font-bold hover:to-blue-100 z-50 mt-3">
                    Download Invoice
                  </Link>
                </div>
              </div>

            </div>
        }
      </div>

    </div >
  );
};

export default BookingData;

