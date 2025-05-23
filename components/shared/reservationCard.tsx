"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import {
  CalculatePrice,
  checkBookingDatesAvailable,
  getDisabledDates,
} from "@/actions/booking/booking.action";
import {
  Calendar as CalendarIcon,
  IndianRupee,
  MinusIcon,
  PlusIcon,
  Users,
} from "lucide-react";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import { Button } from "@/components/ui/button";

import "@/styles/calender.css";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useUserStore } from "@/store/store";
import toast from "react-hot-toast";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays } from "date-fns";
import { calculateDaysDifference, formatNumberWithCommas } from "@/app/details/[id]/paymentUtils/utils";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import BookingCancellationPolicy from "./bookingCancellationPolicy";

interface ReservationCardProps {
  propertyId: string;
  pricePerDay?: number; // Make this optional if it can be undefined
  cancellationType: string;
  maxGuest: number;
  pricePerGuest: number;
  villaData: any;
}

export default function ReservationCard({
  propertyId,
  pricePerDay,
  cancellationType,
  maxGuest,
  pricePerGuest,
  villaData,
}: ReservationCardProps) {
  const router = useRouter();

  var maxGuestSet = true;

  if (maxGuest == undefined || maxGuest == null) {
    maxGuestSet = false;
  }

  const pricePerNight: any = pricePerDay;
  var CancellationAlloweddays = 15
  if (cancellationType == 'FIRM')
    CancellationAlloweddays = 30
  else if (cancellationType == 'FLEXIBLE')
    CancellationAlloweddays = 15
  else
    CancellationAlloweddays = 7

  const [checkoutOnlyDates, setCheckoutOnlyDates] = useState<Date[]>([]);
  const [disabledDatesUI, setDisabledDatesUI] = useState([]);
  const [calenderFlag, setCalenderFlag] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  //  set date range
  const searchParams = useSearchParams();
  const checkin = searchParams?.get("checkin");
  const checkout = searchParams?.get("checkout");
  const adults = searchParams?.get("adults");
  const children = searchParams?.get("children");
  const pets = searchParams?.get("pets");

  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: checkin ? new Date(checkin) : new Date(),
      endDate: checkout
        ? new Date(checkout)
        : new Date(new Date().setDate(new Date().getDate() + 1)),
      key: "selection",
    },
  ]);

  const formatToYYYYMMDD = (date: any) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${monthName} ${year}`;
  };

  const onSelectDate = (ranges: any) => {

    let adjustedEndDate = ranges.selection.endDate;
    const sortedCustomDates = checkoutOnlyDates.sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    // Find the closest custom date after the start date
    const closestCustomDate = sortedCustomDates.find(
      (date) => ranges.selection.startDate <= date,
    );

    // If the start date is less than a custom date and the end date exceeds it, truncate to the closest custom date
    if (
      closestCustomDate &&
      ranges.selection.startDate <= closestCustomDate &&
      ranges.selection.endDate > closestCustomDate
    ) {
      adjustedEndDate = closestCustomDate;
    }

    // Update the selected date range
    setSelectedDateRange([
      {
        startDate: ranges.selection.startDate,
        endDate: adjustedEndDate,
        key: "selection",
      },
    ]);
  };


  useEffect(() => {
    const fetchDisabledDates = async () => {

      setCalenderFlag(false);

      const dates: any = await getDisabledDates(propertyId);

      setDisabledDatesUI(dates["disabledDates"]);
      setCheckoutOnlyDates(dates["checkoutOnlyDates"]);

      setCalenderFlag(true);
    };

    fetchDisabledDates();
  }, [propertyId]);

  const [numberofdays, setnumberofdays] = useState(1);

  const dayContentRenderer = (date: Date) => {
    // Compare if the current date is in the list of checkoutOnlyDates
    const isCheckoutOnly = checkoutOnlyDates.some(
      (d) => d.toDateString() === date.toDateString(), // Compare with `date` argument
    );

    return (
      isCheckoutOnly && (
        <div
          className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-400} 
          `}
          title={"Checkout only"}
        >
          {date.getDate()}
        </div>
      )
    );
  };

  //add guest logics
  const parsedAdults = Number(adults) || 1;
  const parsedChildren = Number(children) || 0;
  const parsedPets = Number(pets) || 0;

  // Initialize state
  const [adultsCount, setAdultsCount] = useState(parsedAdults);
  const [childrenCount, setChildrenCount] = useState(parsedChildren);
  const [petsCount, setPetsCount] = useState(parsedPets);
  const [guestsCount, setGuestsCount] = useState(adultsCount + childrenCount); // Total guests count
  const [guestsFormattedString, setGuestsFormattedString] = useState("1 guest");

  const [bookingDetails, setBookingDetails] = useState({
    userId: "place_holder_value",
    propertyId: propertyId,
    checkinDate: new Date(),
    checkoutDate: addDays(new Date(), 1),
    adults: 1,
    children: 0,
    pets: 0,
    totalPrice: 0,
    extraPrice: 0,
    status: "pending", // initial status
  });

  const [priceLoading, setPriceLoading] = useState(false);
  async function fetchPrice() {
    const startDate = selectedDateRange[0].startDate;
    const endDate = selectedDateRange[0].endDate;
    if (startDate == endDate) {
      toast.error("Checkin and Checkout date cannot be same");
      return;
    }
    setPriceLoading(true);


    const daysDifference = calculateDaysDifference(startDate, endDate);
    setnumberofdays(daysDifference);
    const calculatedPrice: any = await CalculatePrice({
      propertyId: propertyId,
      checkinDate: selectedDateRange[0].startDate,
      checkoutDate: selectedDateRange[0].endDate,
      adults: adultsCount,
      children: childrenCount,
      pets: petsCount,

    });


    let totalPrice = 0;
    if (calculatedPrice.success) {
      totalPrice = calculatedPrice.totalPrice;
      // totalPrice += extraGuestPrice;
    }
    console.log(totalPrice)

    setBookingDetails((prevDetails: any) => ({
      ...prevDetails,
      totalPrice: totalPrice,
      checkinDate: startDate,
      checkoutDate: endDate,
      // extraPrice: extraPrice,
    }));
    console.log("calculated price is ", calculatedPrice);
    setPriceLoading(false);

  }
  useEffect(() => {
    fetchPrice();
  }, [selectedDateRange]);
  useEffect(() => {
    let extraPrice = 0;
    const daysDifference = calculateDaysDifference(selectedDateRange[0].startDate, selectedDateRange[0].endDate);
    let extraGuest = 0;
    console.log("guests count is ", guestsCount);
    console.log("max guest is ", maxGuest);
    if (adultsCount > maxGuest) {
      extraGuest = adultsCount - maxGuest;
    }

    extraPrice = extraGuest * pricePerGuest * daysDifference;


    console.log(extraPrice, daysDifference, extraGuest)

    setBookingDetails((prevDetails: any) => ({
      ...prevDetails,
      extraPrice: extraPrice,
    }));
  }, [selectedDateRange, adultsCount]);

  useEffect(() => {
    const formattedGuestsString = formatGuestsString();
    setGuestsFormattedString(formattedGuestsString);

    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      adults: adultsCount,
      children: childrenCount,
      pets: petsCount,
    }));
  }, [adultsCount, childrenCount, petsCount]);


  const decrementCount = (type: string) => {
    switch (type) {
      case "adults":
        setAdultsCount(Math.max(adultsCount - 1, 0));
        break;
      case "children":
        setChildrenCount(Math.max(childrenCount - 1, 0));
        break;
      case "pets":
        setPetsCount(Math.max(petsCount - 1, 0));
        break;
      default:
        break;
    }
  };

  const incrementCount = (type: string) => {
    switch (type) {
      case "adults":
        setAdultsCount(adultsCount + 1);
        break;
      case "children":
        setChildrenCount(childrenCount + 1);
        break;
      case "pets":
        setPetsCount(petsCount + 1);
        break;
      default:
        break;
    }
  };

  const formatGuestsString = () => {
    const guestsArray = [];
    let totalGuests = 0;

    if (adultsCount > 0) {
      totalGuests += adultsCount;
      guestsArray.push(`${adultsCount} adult${adultsCount !== 1 ? "s" : ""}`);
    }
    if (childrenCount > 0) {
      totalGuests += childrenCount;
      guestsArray.push(
        `${childrenCount} children${childrenCount !== 1 ? "s" : ""}`,
      );
    }
    if (petsCount > 0) {
      totalGuests += petsCount;
      guestsArray.push(`${petsCount} pet${petsCount !== 1 ? "s" : ""}`);
    }

    // If all counts are zero, display "1 guest"
    if (guestsArray.length === 0) {
      guestsArray.push("1 guest");
    }

    setGuestsCount(totalGuests); // Update total guests count
    return guestsArray.join(", ");
  };

  const currentPath = usePathname();
  const { user } = useUserStore();
  const [processing, setProcessing] = useState(false);
  const handleCreateBooking = useCallback(async () => {
    if (processing || priceLoading) return;

    setProcessing(true);
    const loadingToast = toast.loading("Checking availability...");

    if (!user) {
      toast.dismiss(loadingToast);
      toast.error("Please Sign in First");
      setProcessing(false);
      router.push(`/login?redirect=${currentPath}`);
      return;
    }

    if (villaData?.isListed === false) {
      toast.error("This property is not listed anymore. Please try another property.");
      setProcessing(false);
      return;
    }

    const isAvailable = await checkBookingDatesAvailable(
      bookingDetails.checkinDate,
      bookingDetails.checkoutDate,
      propertyId,
    );

    toast.dismiss(loadingToast); // Remove loading toast

    if (isAvailable) {
      localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
      console.log(localStorage.getItem("bookingDetails"));

      const newPath = `${currentPath}/bookingconfirmation?checkInDate=${bookingDetails.checkinDate}&checkOutDate=${bookingDetails.checkoutDate}&adultCount=${bookingDetails.adults}&childrenCount=${bookingDetails.children}&petsCount=${pets}`;

      toast.success("Booking available! Redirecting...");
      router.push(newPath);
    } else {
      toast.error("The selected dates are unavailable. Please choose different dates.");
    }

    setProcessing(false);
  }, [bookingDetails]);

  return (
    <div className="hidden sticky top-20 lg:flex justify-center items-center h-[450px] w-[700px] m-2 rounded-2xl">
      <div className="h-full w-[90%] bg-[#fcf3eb] rounded-2xl flex flex-col  p-4">
        <div className="flex items-center">
          <IndianRupee />

         {priceLoading ? <div className="flex"><p className="animate-pulse h-4 bg-[#e0e0e0] rounded w-24"> </p><span className="text-lg text-gray-400 font-semibold">/night</span></div> : ( <p className="text-2xl font-bold items-center">
          {formatNumberWithCommas(bookingDetails?.totalPrice / numberofdays)}{" "}
            <span className="text-lg text-gray-400 font-semibold">/night</span>
          </p>)}
        </div>
        {maxGuestSet ? (
          <p className="pl-4 p-2 text-sm text-gray-400 font-semibold">
            max {maxGuest} guests, extra guests will cost ₹{pricePerGuest} per
            head
          </p>
        ) : null}

        <div className="w-full flex flex-col px-4 my-4 gap-4">
          <div className="w-full h-[120px] bg-white rounded-2xl">
            <div className="w-full h-[60px] border-2 rounded-t-2xl px-2 p-1 text-xs font-semibold text-gray-400">
              <p>check-in check-out dates</p>
              <Popover>
                <PopoverTrigger asChild>
                  <button id="date" className="w-full flex gap-2 text-sm p-2">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <p>
                      {formatToYYYYMMDD(selectedDateRange[0].startDate)}{" "}
                      <span className="px-2"> - </span>
                      {formatToYYYYMMDD(selectedDateRange[0].endDate)}
                    </p>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 flex relative right-[46vw] 2xl:right-[40vw] drop-shadow-2xl">
                  {calenderFlag ? (
                    <DateRange
                      rangeColors={["#262626"]}
                      ranges={selectedDateRange}
                      date={new Date()}
                      onChange={onSelectDate}
                      direction="horizontal"
                      showDateDisplay={false}
                      // showSelectionPreview={false}
                      minDate={new Date()}
                      disabledDates={disabledDatesUI}
                      months={2}
                      className="datepicker"
                      dayContentRenderer={dayContentRenderer}
                    />
                  ) : (
                    <h1>Loading...</h1>
                  )}
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full h-[60px] border-2 rounded-b-2xl border-t-0 px-2 p-1 text-xs font-semibold text-gray-400">
              <p>guests</p>

              <Popover>
                <PopoverTrigger asChild>
                  <button id="date" className="w-full flex gap-4 text-sm p-2">
                    <Users className="size-4" /> {guestsFormattedString}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="p-0 flex relative w-[300px]   right-[20vw] shadow-lg bg-transparent border-0">
                  <div className="w-full  mt-4 max-h-[350px]  bg-white p-5  flex flex-col items-center justify-center rounded-xl">

                    {/* <DropdownMenuContent className='mt-5 exclude-class  p-4 rounded-3xl '> */}

                    <div className="mb-4 px-2 py-1 w-full flex-row flex items-center justify-between border-gray-200">
                      <div className="flex items-center flex-col justify-between mb-2">
                        <span className="text-gray-900 font-semibold text-lg w-full text-left">Adults</span>
                        <span className="text-sm text-gray-500">Ages 13 or above</span>
                      </div>
                      <div className="flex items-center flex-col justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => decrementCount('adults')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                          </Button>
                          <span className="text-md font-medium text-gray-700">{adultsCount}</span>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => incrementCount('adults')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 px-2 py-1 w-full  flex-row flex items-center justify-between  border-gray-200">
                      <div className="flex items-center flex-col justify-between mb-2">
                        <span className="text-gray-900 font-semibold text-lg  w-full text-left">Children</span>
                        <span className="text-sm text-gray-500">Ages 2–12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => decrementCount('children')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                          </Button>
                          <span className="text-md font-medium text-gray-700">{childrenCount}</span>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => incrementCount('children')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className=" px-2 py-1 w-full  flex-row flex items-center justify-between  border-gray-200">
                      <div className="flex items-center flex-col justify-between mb-2">
                        <span className="text-gray-900 font-semibold text-lg  w-full text-left">Pets</span>
                        <span className="text-sm text-gray-500">Bringing a service animal?</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => decrementCount('pets')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                          </Button>
                          <span className="text-md font-medium text-gray-700">{petsCount}</span>
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={() => incrementCount('pets')}
                            className="p-3 rounded-full border border-gray-300"
                          >
                            <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                          </Button>
                        </div>
                      </div>
                    </div>


                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex" >
            <p className="text-xs text-gray-400 font-semibold" >For Booking & Cancellation Policy details</p>
            <button
              className="text-xs text-gray-400 font-semibold pl-1"
              onClick={() => setIsPopupOpen(true)} >
              <p className="underline font-semibold">Click here</p>
            </button>
          </div>

          {isPopupOpen && (
            <BookingCancellationPolicy setIsPopupOpen={setIsPopupOpen} cancellationType={cancellationType} />
          )}


          <button  
            className="w-full h-[50px] red-gradient rounded-2xl flex justify-center items-center text-xl font-bold text-white"
            onClick={handleCreateBooking}
            disabled={processing || priceLoading}
          >
            {processing || priceLoading ? "Processing " : "Reserve"}
          </button>

          {/* <Link href={`../details/${propertyId}/bookingconfirmation`} 
          className="w-full h-[50px] red-gradient rounded-2xl flex justify-center items-center text-xl font-bold text-white">Reserve Now</Link> */}
        </div>

        <div className="pt-2 flex flex-col w-full justify-center items-end px-8 ">


          {
            priceLoading ? (
              <div className="animate-pulse space-y-2">
                {/* Base Price Loader */}
                <div className="h-4 bg-[#e0e0e0] rounded w-48 ml-auto"></div>

                {/* Extra Guest Loader (if applicable) */}
                <div className="h-4 bg-[#e0e0e0] rounded w-64 ml-auto"></div>

              </div>
            ) : (
              <div className="font-bold text-lg">
                <p className="text-sm text-gray-500 text-right">
                  ₹{formatNumberWithCommas(bookingDetails?.totalPrice / numberofdays)} x {numberofdays} days{" "}
                </p>
                <p className="font-semibold text-sm text-gray-500 text-right">
                  {guestsCount > maxGuest
                    ? `${guestsCount - maxGuest} extra guest x ${formatNumberWithCommas(pricePerGuest)} x ${numberofdays} days`
                    : null}
                </p>
                <p className="font-semibold text-sm text-gray-500 pb-2 text-right">
                  {` + service Fee =  ${formatNumberWithCommas((bookingDetails?.totalPrice + bookingDetails.extraPrice) * 0.025)}`}
                </p>
                <p className="font-bold text-lg text-right">
                  {" "}
                  Total = ₹{formatNumberWithCommas(bookingDetails.totalPrice + bookingDetails.extraPrice + (bookingDetails.totalPrice + bookingDetails.extraPrice) * 0.025)}
                </p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}



