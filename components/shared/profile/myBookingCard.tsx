import Image from "next/image";
import Link from "next/link";
import { IoDocumentTextOutline } from "react-icons/io5";

interface MyBookingCardProps {
  bookingId: string;
  villaId: string;
  villaName: string;
  villaImage: string;
  amount: string;
  city: string;
  state: string;
  bookingDate: string;
  invoiceLink: string;
  addreviewflag: boolean
}

export default function BookedVillaCard({bookingId, villaId, villaName, villaImage, amount, city, state, bookingDate, invoiceLink, addreviewflag} : MyBookingCardProps){

  console.log({addreviewflag})

  // const handleDetailsRedirect = () => {

  // }

  return (
    <div className="w-full h-auto duration-300 gap-4 shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] rounded-lg px-3 py-2 flex flex-col justify-between hover:border-pink-600 border border-transparent hover:shadow-xl">
      <div className="flex px-2 flex-row items-start md:items-center justify-between gap-4">
        <div className="w-[70px] h-[50px] mt-4 md:mt-0 md:w-[100px] md:h-[100px] relative overflow-hidden rounded-lg">
          <Image
            src={villaImage}
            alt="Villa Image"
            width={80}
            height={80}
            className="object-contain w-full h-full rounded-lg"
          />
        </div>
        <div className="flex flex-col justify-between w-full md:w-[70%] p-2">
          <div className="md:mt-2">
            <Link href={`../details/${villaId}`} className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors">
              {villaName.length > 20 ? `${villaName.slice(0, 20)}...` : villaName}
            </Link>
            <p className="text-sm text-gray-600">{city}, {state}</p>
            <p className="text-sm text-gray-600">Booked on {bookingDate}</p>
          </div>
          {!addreviewflag && <Link href={`/add-review/?villaId=${villaId}&bookingId=${bookingId}`}  className="py-1 w-full  text-right  text-sm font-semibold  gap-1  transition-colors mt-2">
            {/* <RiStarSmileLine size={20} /> */}
            <span className="text-right text-gray-500 w-full underline">Add Review</span> 
          </Link>}
        </div>
      </div>

      <div className="flex flex-row justify-between p-2 mt-2">
        <p className="font-semibold text-gray-800">
          <span className="font-light ">Paid: </span> ₹{amount} 
        </p>
        <Link href={invoiceLink} className="border border-pink-600 hover:red-gradient text-pink-600 hover:text-white  py-1 px-3 rounded-sm text-sm flex justify-center items-center gap-1 transition-colors">
          <IoDocumentTextOutline  />
          <span className="">Download Invoice</span>
        </Link>
      </div>
    </div>
  );
}
