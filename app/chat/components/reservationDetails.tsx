import React from "react";
import Image from "next/image";
import { BsSuitcase2 } from "react-icons/bs";
import { useSearchParams } from 'next/navigation';

const ReservationDetails = () => {

  const searchParams = useSearchParams();
  const stayName = searchParams?.get('stay') ?? null;
  const stayId = searchParams?.get('id') ?? null;

  return (
    <div className="w-full bg-white h-screen px-5">
      <p className="text-xl font-medium p-6">Reservation</p>
      <div className="w-full border rounded-xl flex justify-between p-3">
        <div className="p-1">
          <p className="text-xs">Enquiry</p>
          <p className="font-bold">Javed have asked about a trip</p>
          <p className="text-[14px]">{stayName}</p>
          {/* <p className='text-[14px]'>Varca, Goa</p> */}
          {/* <p className="text-[14px]">20-23 july (3 nights)</p>
          <p className="text-[14px]">11 guests - ₹ 45,000</p> */}
        </div>
        <div className="w-10 h-10 rounded-full m-1 overflow-hidden bg-gray-300">
          <Image
            alt="villa image"
            src={
              "https://media.licdn.com/dms/image/C4E03AQEuypPyf3lHrw/profile-displayphoto-shrink_200_200/0/1643467778087?e=1726099200&v=beta&t=FgRpAidXiO2ZjCbKvO5QglUSAfSflUAx9W79Z-Y0Qqs"
            }
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      {/* <div className="border rounded-xl p-2 mt-3 flex flex-col gap-2 font-semibold">
        <button className="border border-black rounded-lg w-full p-2 flex justify-center hover:bg-gray-100">
          <p>Pre-approve</p>
        </button>
        <div className="w-full flex justify-center gap-4">
          <button className="border border-black rounded-lg w-full p-2 flex justify-center hover:bg-gray-100">
            <p>Special offer</p>
          </button>
          <button className="border border-black rounded-lg w-full p-2 flex justify-center hover:bg-gray-100">
            <p>Decline</p>
          </button>
        </div>
      </div> */}

      <hr className="my-5 h-2 bg-gray-100" />
      <div className="p-2">
      <p className="text-xl font-bold">About Javed</p>
      <div className="mt-6 flex gap-2 font-light">
      <BsSuitcase2 size={24} className="text-gray-900"/>
      <p>no trips yet</p>
      </div>
      <div className="mt-6 flex gap-2 font-light">
      <div className="w-6 h-6">
      <Image
            alt="villa image"
            src={
              "/logo.png"
            }
            width={50}
            height={50}
            className="object-contain w-full h-full"
          />
      </div>
      <p>Joined bnbIndia in 2024</p>
      </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
