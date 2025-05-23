"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Calendar} from "rsuite";

import "rsuite/Calendar/styles/index.css";

import { format, isBefore, isSameDay, startOfDay } from "date-fns"; // Install date-fns if not already installed

import "./BigCalender.css";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  getListingForOwner
} from "@/actions/listing/listing.action";
import {
  addHotelData,
  getHotelData
} from "@/actions/price/price.action";
import { useUserStore } from "@/store/store";

// function getTodoList(date: any) {
//   const day = date.getDate();
//   // Generate a list of todos for each day of the month
//   return [{ date: day, title: "3000", price: "300" }];
// }

interface PricingDetails {
  price: number;
  discount: number;
  minBookingDays: number;
}

// interface HotelData {
//   id: number;
//   hotelId: number;
//   month: string;
//   date: string;
//   pricingDetails: PricingDetails;
// }

const Calender = ({ Villa_id }: any) => {
  const router = useRouter();
  const [hotelPriceData, setHotelPriceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reRender, setReRender] = useState(false);
  const today = startOfDay(new Date());
  const [selectedDate, setSelectDate] = useState(today);
  const [currentMonth, setcurrentMonth] = useState(format(today, "MMMM"));
  

  const { user } = useUserStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [currentVilla, setCurrentVilla] = useState<any>();
  const [error, setError] = useState<any>();

  const handleFetchListings = async () => {
    const data: any = await getListingForOwner();
    setListings(data.data || []);
    console.log("Listing data is ", data);
    const currentVillaData = data.data.filter(
      (villaData: any) => villaData.listing_id === Villa_id,
    );
    // console.log(currentVillaData , user.user_id);

    if (!currentVillaData || currentVillaData[0]?.host_id !== user.user_id) {
      
      setError("You are not authorized");
    }

    setCurrentVilla(currentVillaData[0]);
    // console.log(currentVillaData[0]);

    // console.log(currentVilla);
  };

  const [currentPriceDetails, setCurrentPriceDetails] = useState({
    price: 0, // Default price
    discount: 0,
    minBookingDays: 1,
  });
  
  useEffect(() => {
    if (currentVilla?.pricePerDay) {
      setCurrentPriceDetails((prev) => ({
        ...prev,
        price: Number(currentVilla.pricePerDay) || 0,
      }));
    }
  }, [currentVilla]);
  

  useEffect(() => {
    handleFetchListings();
  }, []);

  const fetchHotelData = async (currentMonth: any) => {
    try {
      // console.log("going for ftech hotels...");
      // setLoading(true);
      // alert("going for fetch")
      const response: any = await getHotelData(Villa_id);

      // console.log("Response got ", response);
      setHotelPriceData(response);
      // setLoading(false);
    } catch (err: any) {
      // setError();
      console.error("error at Fetch Hotel data", err);
    }
  };
  useEffect(() => {
    fetchHotelData(currentMonth);
  }, [currentMonth, reRender]);

  const [isBlocked, setisBlocked] = useState(true);

  const ToggleBlock = () => {
    handlePriceSubmit(!isBlocked);
    setisBlocked((prev: any) => !prev);
  };

  let count = 0;

  function renderCell(date: any) {
    // const currentMonth = today.getMonth();
    // console.log("current month", currentMonth);

    const isOtherMonth = format(date, "MMMM") !== currentMonth;

    // console.log(format(date, "MMMM"),currentMonth, date);
    const list = hotelPriceData.filter((item: any) => {
      return isSameDay(new Date(item?.date), date);
    });
    if (isOtherMonth) {
      return null;
    }
    if (list.length) {
      return (
        <ul className="calendar-todo-list">
          {list.map((item: any, index) => (
            <li key={index}>
              <p className="font-bold">
                {item.blockNight ? (
                  <span className="text-red-700"> Blocked</span>
                ) : (
                  `Rs. ${item?.pricingDetails.price}`
                )}
              </p>
            </li>
          ))}
        </ul>
      );
    }
    return <></>;
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^Rs\s?/, "");

    // Validate if the input is a valid integer
    if (/^\d*$/.test(value)) {
      setCurrentPriceDetails((prevDetails: any) => ({
        ...prevDetails,
        price: parseInt(value, 10) || Number(currentVilla?.pricePerDay), // Ensure a valid integer is set, default to 0 if NaN
      }));
    }
  };

  const handlePriceSubmit = async (isBlockStatus: boolean) => {
    if (isBefore(selectedDate, today)) {
      alert("You cannot change past date data !!");
    } else {
      const data = {
        villa_id: Villa_id,
        date: selectedDate,
        pricingDetails: currentPriceDetails,
        blockNight: isBlockStatus,
      };
      console.log("Changing data", data)
      try {
        setLoading(true);
        const newPriceData = await addHotelData(data);
        console.log("New price data added:", newPriceData);
        setReRender(!reRender);
        setLoading(false);
      } catch (error) {
        console.error("Error adding price data:", error);
      }
    }
  };

  // Storing the selected date data in CurrentPriceDetails
  useEffect(() => {
    const selectedHotelData: any = hotelPriceData.find((item: any) =>
      isSameDay(new Date(item.date), selectedDate),
    );
  
    if (selectedHotelData) {
      setCurrentPriceDetails(selectedHotelData?.pricingDetails);
      setisBlocked(selectedHotelData?.blockNight);
    } else {
      setCurrentPriceDetails({
        price: Number(currentVilla?.pricePerDay), // <-- Defaulting to villa price
        discount: 0,
        minBookingDays: 1,
      });
      setisBlocked(false);
    }
  }, [selectedDate, hotelPriceData]);
  

  const AlterDiscount = (val: any) => {
    setCurrentPriceDetails((prevDetails: any) => ({
      ...prevDetails,
      discount: prevDetails.discount + val,
    }));
  };
  const AlterMinDays = (val: any) => {
    setCurrentPriceDetails((prevDetails: any) => ({
      ...prevDetails,
      minBookingDays: prevDetails.minBookingDays + val,
    }));
  };
  if (error) {
    return (
      <div className="flex items-center justify-center h-[40vh]">{error}</div>
    );
  }
  return (
    <div className="w-full overflow-x-hidden my-[10px] min-h-[90vh] flex flex-col-reverse gap-4 lg:gap-0 lg:flex-row justify-between mt-[10px]">
      {loading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-700 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <Image
            alt="Loading Gif"
            src="/loading.gif"
            width={100}
            height={100}
          />
        </div>
      ) : (
        <></>
      )}
      <>
        <div className="w-full lg:w-[79vw]">
          <Calendar
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            bordered
            cellClassName={(date) => {
              const isOtherMonth = format(date, "MMMM") !== currentMonth;
              if (isOtherMonth) {
                return "other-month";
              }
              if (isBefore(date, today)) {
                return "bg-gray cell-boundary";
              }
              if (isSameDay(date, today)) {
                return "rs-calendar-table-cell-selected";
              }
              // const list: any = hotelPriceData.filter((item: any) => isSameDay(new Date(item?.date), date));
              // if (list?.length && list[0]?.blockNight) {
              //   return "blocked-cell";
              // }
              return "cell-boundary";
            }}
            onChange={(date) => {
              setSelectDate(date);
              setcurrentMonth(format(date, "MMMM"));
              // console.log(date);
            }}
            renderCell={renderCell}
          />
        </div>
        <div className="w-full lg:w-[20vw] h-auto  border-grey-700 rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] mx-1 ">
          <div className="relative">
            {currentVilla && (
              <div
                className="m-2 flex h-auto sm:h-[10vh] items-center justify-between p-4 shadow-md rounded-lg border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white"
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                }}
              >
                <Image
                  alt="villa image"
                  className="rounded-lg"
                  src={currentVilla?.coverImage || "/h1.jpg"}
                  width={60}
                  height={60}
                />
                <p className="flex-grow mx-4 text-lg sm:text-xl font-semibold text-gray-900">
                  {currentVilla?.title || "No Title"}
                </p>
                <svg
                  className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </div>
            )}

            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 left-2 w-full lg:w-[19vw] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100">
                {listings.map((listing: any) => {
                  if (listing.listing_id !== Villa_id && listing.isListed !== false) {
                    return (
                      <div
                        key={listing.listing_id}
                        className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          // navigation will happen
                          router.push(
                            `/hostpanel/Calender/${listing.listing_id}`,
                          );
                        }}
                      >
                        {listing.title}
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
          <div className=" pb-[10px] border-gray-300">
            <p className="text-2xl font-bold px-4 pt-4">Settings</p>
            <p className="text-sm px-4">You can make changes to the Price </p>
          </div>
          <div className="cursor-pointer">
            {/* toggle */}
            <p className="mx-[20px] mt-1 text-lg font-semibold">
              {format(selectedDate, "d MMMM")}{" "}
            </p>
            <p className="w-full ml-[20px] text-sm mt-[20px]">
              Have Booking Block this night ?
            </p>
            <div className="w-[94%] mx-auto shadow rounded-full h-10 mt-[5px] flex p-1 relative items-center">
              <div className="w-full flex justify-center" onClick={ToggleBlock}>
                <button
                  className={`font-semibold ${!isBlocked ? "text-black" : "text-gray-500"}`}
                >
                  Open
                </button>
              </div>

              <div className="w-full flex justify-center" onClick={ToggleBlock}>
                <button
                  className={`${isBlocked ? "text-black" : "text-gray-500"}`}
                >
                  Block Night
                </button>
              </div>
              <span
                className={`elSwitch bg-gray-900 shadow text-white flex items-center justify-center w-1/2 rounded-full h-8 transition-all top-[4px] absolute ${isBlocked ? "left-1/2" : "left-1"}`}
              >
                {!isBlocked ? "Open" : "Block Night"}
              </span>
            </div>
          </div>
          <p className="w-full ml-[20px] text-sm mt-[20px]">
            Want to Update the Price ?
          </p>
          <div className="mx-[13px] mt-[5px]">
            <input
              type="text"
              placeholder="Rs Enter price..."
              value={`Rs ${currentPriceDetails.price}`}
              onChange={handlePriceChange}
              className="w-full font-bold text-[22px] border-gray-600 border rounded-xl px-5 py-2 focus:outline-none focus:border-grey-700"
            />
            <div
              onClick={() => {
                handlePriceSubmit(isBlocked);
              }}
              className="w-full cursor-pointer mt-2 flex justify-center items-center red-gradient h-[40px] rounded-xl text-white font-bold hover:to-blue-100 z-50"
            >
              Update Price
            </div>
          </div>
          <div className="mx-[13px] ">
            <p className="text-xl font-bold px-1 pt-4">OtherAction</p>
            <div className="px-1 border-[1px] py-2 mt-2 rounded-md">
              <p className="text-lg font-bold h-auto px-4 ">Discount</p>
              <p className="text-sm px-4">
                Add discount and attract more people{" "}
              </p>
              <div className="flex flex-row items-center justify-around">
                <div className="flex  w-[70%] items-center  justify-center px-1 mt-2">
                  <button
                    onClick={() => {
                      AlterDiscount(-1);
                    }}
                    className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2 h-8 rounded-md  items-center justify-center flex bg-gray-200 w-[50%] text-lg text-center font-semibold">
                    {currentPriceDetails.discount}%
                  </span>
                  <button
                    onClick={() => {
                      AlterDiscount(1);
                    }}
                    className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md"
                  >
                    +
                  </button>
                </div>
                <div className="w-[25%]  h-auto">
                  <div
                    onClick={() => {
                      handlePriceSubmit(isBlocked);
                    }}
                    className="w-full mt-2 flex cursor-pointer justify-center items-center red-gradient h-8 rounded-md text-white font-bold hover:to-blue-100 z-50"
                  >
                    Save
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="px-1 border-[1px] py-2 mt-2 rounded-md">
              <p className="text-lg font-bold h-auto px-4 ">Min Day Booking</p>
              <p className="text-sm px-4">
                Add Minimum no of day of booking required{" "}
              </p>
              <div className="flex flex-row items-center justify-around">
                <div className="flex  w-[70%] items-center  justify-center px-1 mt-2">
                  <button
                    onClick={() => {
                      AlterMinDays(-1);
                    }}
                    className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md"
                  >
                    -
                  </button>
                  <span className="mx-2 h-8 rounded-md  items-center justify-center flex bg-gray-200 w-[50%] text-lg text-center font-semibold">
                    {currentPriceDetails.minBookingDays}
                  </span>
                  <button
                    onClick={() => {
                      AlterMinDays(+1);
                    }}
                    className="bg-black text-white w-8 h-8 flex items-center justify-center rounded-md"
                  >
                    +
                  </button>
                </div>
                <div className="w-[25%]  h-auto">
                  <div
                    onClick={() => {
                      handlePriceSubmit(isBlocked);
                    }}
                    className="w-full cursor-pointer mt-2 flex justify-center items-center red-gradient h-8 rounded-md text-white font-bold hover:to-blue-100 z-50"
                  >
                    Save
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </>
    </div>
  );
};

export default Calender;
