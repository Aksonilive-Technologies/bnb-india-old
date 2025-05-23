"use client";

import { useEffect, useState, useRef } from "react";

import "react-datepicker/dist/react-datepicker.css";

import { CalculatePrice, checkBookingDatesAvailable, getDisabledDates } from "@/actions/booking/booking.action";
import toast from "react-hot-toast";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useUserStore } from "@/store/store";

import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { Button } from "../ui/button";
import { DateRange } from "react-date-range";
import { addDays } from "date-fns";
import { calculateDaysDifference, formatNumberWithCommas } from "@/app/details/[id]/paymentUtils/utils";
import { formatToYYYYMMDD } from "@/utils/formatTimeStamp";

export default function BottomBar({ Listingdata, propertyId }: any) {


    const pricePerGuest = Listingdata[0]?.pricePerGuest
    const maxGuest = Listingdata[0]?.maxGuests
    const pricePerDay = Listingdata[0]?.pricePerDay
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const router = useRouter();

    var maxGuestSet = true

    if (maxGuest == undefined || maxGuest == null) {
        maxGuestSet = false
    }

    const pricePerNight: any = pricePerDay
    const [checkoutOnlyDates, setCheckoutOnlyDates] = useState<Date[]>([]);
    const [disabledDatesUI, setDisabledDatesUI] = useState([]);
    const [calenderFlag, setCalenderFlag] = useState(false);

    const searchParams = useSearchParams();
    const checkin = searchParams?.get("checkin");
    const checkout = searchParams?.get("checkout");
    const adults = parseInt(searchParams?.get("adults") ?? "1", 10) || 0;
    const children = parseInt(searchParams?.get("children") ?? "0", 10) || 0;
    const pets = parseInt(searchParams?.get("pets") ?? "0", 10) || 0;



    //  set date range
    const [selectedDateRange, setSelectedDateRange] = useState([
        {
            startDate: checkin ? new Date(checkin) : new Date(),
            endDate: checkout
                ? new Date(checkout)
                : new Date(new Date().setDate(new Date().getDate() + 1)),
            key: "selection",
        },
    ]);
    useEffect(() => {
        // Define default values for checkin and checkout
        const defaultCheckin = checkin ? new Date(checkin) : new Date();
        const defaultCheckout = checkout
            ? new Date(checkout)
            : new Date(new Date().setDate(defaultCheckin.getDate() + 1));
        const daysDifference = calculateDaysDifference(defaultCheckin, defaultCheckout);
        console.log("Days Difference:", daysDifference);
        setnumberofdays(daysDifference);
        // Fetch price based on selected dates
        fetchPrice({
            startDate: defaultCheckin,
            endDate: defaultCheckout,
            key: "selection",
        });

    }, [checkin, checkout]);


    const dayContentRenderer = (date: Date) => {

        const isCheckoutOnly = checkoutOnlyDates.some(
            (d) => d.toDateString() === date.toDateString(),
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
    const onSelectDate = (ranges: any) => {
        console.log("select ranges called ", ranges)
        console.log("Select ranges called: ", ranges);

        const { startDate, endDate } = ranges.selection;

        // Check if startDate is greater than endDate and swap if necessary
        if (startDate > endDate) {
            ranges.selection.startDate = endDate;
            ranges.selection.endDate = startDate;
        }
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
        const NewRangeData = {
            startDate: ranges.selection.startDate,
            endDate: adjustedEndDate,
            key: "selection",
        }
        // Update the selected date range
        setSelectedDateRange([NewRangeData]);
        console.log(selectedDateRange[0]);
        const daysDifference = calculateDaysDifference(selectedDateRange[0].startDate, selectedDateRange[0].endDate);

        console.log("Days Difference", daysDifference);
        setnumberofdays(daysDifference);
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            checkinDate: selectedDateRange[0].startDate,
            checkoutDate: selectedDateRange[0].endDate,
        }));
        fetchPrice(NewRangeData);

    };

    useEffect(() => {

        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            checkinDate: selectedDateRange[0].startDate,
            checkoutDate: selectedDateRange[0].endDate,
        }));

    }, [selectedDateRange])

    const [priceLoading, setPriceLoading] = useState(true);
    // const [price, setPrice] = useState(0);
    const [numberofdays, setnumberofdays] = useState(1);
    const [totalPrice, settotalprice] = useState(0);
    const [extraGuestPrice, setExtraGuestPrice] = useState(0);
    async function fetchPrice(range: any) {
        // Ensure selectedDateRange is available
        const startDate = range.startDate;
        const endDate = range.endDate;

        // Validate the dates
        if (!startDate || !endDate) {
            console.error("Start Date or End Date is missing:", startDate, endDate);
            return;
        }
        if (startDate === endDate) {
            console.error("Check-in and Check-out date cannot be the same.");
            return;
        }

        // Indicate loading
        setPriceLoading(true);

        // Log for debugging
        console.log("Fetching price for:");
        console.log("Start Date:", startDate);
        console.log("End Date:", endDate);


        try {
            // Fetch calculated price from the API
            const calculatedPrice: any = await CalculatePrice({
                propertyId: bookingDetails?.propertyId,
                checkinDate: startDate,
                checkoutDate: endDate,
                adults: bookingDetails?.adults,
                children: bookingDetails?.children,
                pets: bookingDetails?.pets,
            });

            // Calculate the days difference
            const daysDifference = calculateDaysDifference(startDate, endDate);
            console.log("Days Difference:", daysDifference);
            setnumberofdays(daysDifference);
            console.log("API Response:", calculatedPrice);

            let totalPrice = 0;
            if (calculatedPrice?.success) {
                totalPrice = calculatedPrice.totalPrice;
            }


            // Update state with calculated prices
            settotalprice(totalPrice);
            setPriceLoading(false);
            console.log("Total Price:", totalPrice);
            // console.log("Extra Guest Price:", extraPrice);
        } catch (error) {
            console.error("Error fetching price:", error);
        }
    }



    useEffect(() => {
        const fetchDisabledDates = async () => {
            setCalenderFlag(false);
            const dates: any = await getDisabledDates(propertyId);

            setDisabledDatesUI(dates['disabledDates']);
            setCheckoutOnlyDates(dates['checkoutOnlyDates'])

            setCalenderFlag(true);

        };

        fetchDisabledDates();
    }, [propertyId]);




    const isMobile = () => {
        if (typeof window !== 'undefined') {
            const screenWidth = window.innerWidth;
            return screenWidth < 640; // Adjust this breakpoint as needed
        }
        else {
            return false
        }
    };

    const [searchType, setSearchType] = useState('');


    //add guest logics
    const [adultsCount, setAdultsCount] = useState(adults);
    const [childrenCount, setChildrenCount] = useState(children);
    const [petsCount, setPetsCount] = useState(pets);
    const [guestsCount, setGuestsCount] = useState(adults + children);
    const [bookingDetails, setBookingDetails] = useState({
        userId: "place_holder_value",
        propertyId: propertyId,
        checkinDate: selectedDateRange[0].startDate,
        checkoutDate: selectedDateRange[0].endDate,
        adults: 1,
        children: 0,
        pets: 0,
        totalPrice: 0,
        status: "pending" // initial status
    });


    useEffect(() => {
        setBookingDetails((prevDetails) => ({
            ...prevDetails,
            adults: adultsCount,
            children: childrenCount,
            pets: petsCount,
        }));
        setGuestsCount(adultsCount + childrenCount)


        let extraPrice = 0;
        let extraGuest = 0;
        if (adultsCount + childrenCount > Listingdata[0]?.maxGuests) {
            extraGuest = adultsCount + childrenCount - Listingdata[0].maxGuests;
            extraPrice = extraGuest * Listingdata[0].pricePerGuest * numberofdays;
        }

        setExtraGuestPrice(extraPrice);

    }, [adultsCount, childrenCount, petsCount, numberofdays]);




    const decrementCount = (type: string) => {
        switch (type) {
            case 'adults':
                setAdultsCount(Math.max(adultsCount - 1, 0));
                break;
            case 'children':
                setChildrenCount(Math.max(childrenCount - 1, 0));
                break;
            case 'pets':
                setPetsCount(Math.max(petsCount - 1, 0));
                break;
            default:
                break;
        }
    };

    const incrementCount = (type: string) => {
        switch (type) {
            case 'adults':
                setAdultsCount(adultsCount + 1);
                break;
            case 'children':
                setChildrenCount(childrenCount + 1);
                break;
            case 'pets':
                setPetsCount(petsCount + 1);
                break;
            default:
                break;
        }
    };

    const currentPath = usePathname();
    const { user } = useUserStore();
    const [processing, setProcessing] = useState(false)
    const handleCreateBooking = async () => {
        if (processing && priceLoading) {
            return;
        }
        setProcessing(true);
        if (!user) {
            toast.error("Please Sign in First")
            router.push(`/login?redirect=${currentPath}`)
            return;
        }
        if (!Listingdata[0].isListed) {
            setProcessing(false);
            toast.error("This villa is not listed !! please choose anoyther villa")
            return;
        }

        const loadingToast = toast.loading("Checking availability...");
        const isAvailable = await checkBookingDatesAvailable(
            bookingDetails.checkinDate,
            bookingDetails.checkoutDate,
            propertyId
        );
        toast.dismiss(loadingToast);
        if (isAvailable) {
            const newPath = `${currentPath}/bookingconfirmation?checkInDate=${bookingDetails.checkinDate}&checkOutDate=${bookingDetails.checkoutDate}&adultCount=${bookingDetails.adults}&childrenCount=${bookingDetails.children}&petsCount=${pets}`;

            // Navigate to the new path
            router.push(newPath);
        }
        else {
            toast.error("The selected dates are unavailable. Please choose different dates.");
        }
        setProcessing(false);

    }
    const handleOpenPopup = () => {
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
    };

    const explandRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                explandRef.current &&
                !explandRef.current.contains(event.target as Node)
            ) {
                setSearchType(''); // Close the calendar when clicking outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <div className="animation duration-300 ease-in-out">
            {isPopupOpen && (
                <div
                    className=" fixed top-0 animate-in duration-500 ease-in-out  left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-30"
                // Close popup when clicking outside
                >
                    <div
                        className="bg-white w-full h-full mt-[11vh] p-3 py-6 rounded-none shadow-none relative animate-slide-up-scale"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
                    >
                        <div className="w-full flex items-center mb-4 justify-between">
                            <h2 className="text-xl font-bold">Plan Your Stay</h2>
                            <div
                                className="flex items-center gap-2 cursor-pointer group"
                                onClick={handleClosePopup}
                            >
                                <p className="text-xs font-bold flex items-center justify-around underline italic">
                                    Close
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm w-[80%] mb-10">
                            Select the date to book your villa and specify the total guest count.
                        </p>

                        <div className='flex w-full h-ful mb-4  flex-col items-center gap-2'>

                            <div className={`border-[1px] flex flex-col items-center justify-between w-full ${searchType === 'count' ? 'bg-white shadow-lg' : 'bg-gray-200'} px-4 py-4 rounded-2xl transition-all duration-300`}>
                                <div
                                    onClick={() => {
                                        setSearchType('count');
                                    }}
                                    className="flex w-full items-center justify-between cursor-pointer"
                                >
                                    <label className="block text-xl h-auto mt-2 font-semibold">Who ?</label>
                                    <p className="text-gray-600">{adultsCount + childrenCount > 1 ? adultsCount + childrenCount + " Guest" : adultsCount + childrenCount + " Guests"}</p>
                                </div>

                                {searchType === 'count' && (
                                    <div ref={explandRef} className="w-full  mt-4 max-h-[350px] flex flex-col items-center justify-center rounded-lg">

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
                                        {/* <DropdownMenuSeparator /> */}
                                        {/* </DropdownMenuContent> */}

                                    </div>
                                )}
                            </div>
                            <div className={`border-[1px]  flex flex-col items-center justify-between w-full ${searchType === 'Date' ? 'bg-white shadow-lg' : 'bg-gray-200'}  py-4 rounded-2xl transition-all duration-300`}>
                                <div
                                    onClick={() => {
                                        setSearchType('Date');
                                    }}
                                    className="flex w-full px-4 items-center justify-between cursor-pointer"
                                >
                                    <label className="block text-xl h-auto mt-2 font-semibold">When?</label>
                                    <p className="text-gray-600">
                                        {formatToYYYYMMDD(selectedDateRange[0]?.startDate)} -
                                        {formatToYYYYMMDD(selectedDateRange[0]?.endDate)}
                                    </p>
                                </div>

                                {searchType === 'Date' && (
                                    <div
                                        ref={explandRef}
                                        className="w-[90vw] mt-4 max-h-[350px] flex items-center justify-center rounded-lg overflow-hidden"
                                    >
                                        {calenderFlag ? (
                                            <div className="flex justify-center w-full"> {/* Wrapper to center the calendar */}
                                                <DateRange
                                                    rangeColors={["#ccadb997"]}
                                                    ranges={selectedDateRange}
                                                    date={new Date()}
                                                    onChange={onSelectDate}
                                                    direction="vertical"
                                                    showDateDisplay={false}
                                                    disabledDates={disabledDatesUI}
                                                    minDate={new Date()}
                                                    months={isMobile() ? 1 : 2}
                                                    className="custom-date-range" // Add a custom class for styling
                                                    // style={{ width: '100%' }} // Ensure it takes full width
                                                    dayContentRenderer={dayContentRenderer}
                                                />
                                            </div>
                                        ) : (
                                            <h1>Loading...</h1>
                                        )}
                                    </div>
                                )}
                            </div>




                        </div>

                        <div className="px-3" onClick={handleOpenPopup}>
                            <p className="text-lg  font-bold">
                                ₹{Listingdata[0]?.pricePerDay}
                                <span className="text-md font-medium">/night</span>
                            </p>
                            <p className="text-md">
                                max {Listingdata[0]?.maxGuests} guests, extra guests will cost ₹
                                {Listingdata[0]?.pricePerGuest} per head
                            </p>
                            {

                                priceLoading ? <p>Loading...</p> : (

                                    <div className="pt-2 flex flex-col w-full justify-center items-end px-8 ">
                                        <p className="text-sm text-gray-500">₹{formatNumberWithCommas(totalPrice / numberofdays)} x {numberofdays} days </p>
                                        <p className="font-semibold text-sm text-gray-500 pb-2">
                                            {guestsCount > maxGuest
                                                ? `${guestsCount - maxGuest} extra guest x ${formatNumberWithCommas(pricePerGuest)} x ${numberofdays} days = ${formatNumberWithCommas(extraGuestPrice)}`
                                                : null}</p>
                                        <p className="font-semibold text-sm text-gray-500 pb-2 text-right">
                                            {` + service Fee =  ${formatNumberWithCommas((totalPrice + extraGuestPrice) * 0.025)}`}
                                        </p>
                                        <p className="font-bold text-lg text-right">
                                            {" "}
                                            Total = ₹{formatNumberWithCommas(totalPrice + extraGuestPrice + (totalPrice + extraGuestPrice) * 0.025)}
                                        </p>

                                    </div>
                                )
                            }

                        </div>

                    </div>
                </div>)
            }
            <div className={`fixed bottom-0 flex  w-full items-center px-2 left-0  z-30 h-[80px]  ${isPopupOpen ? "bg-[#ffffff] justify-center" : "bg-[#f7e7d7] justify-between"} gap-1 lg:hidden `}>

                {
                    !isPopupOpen &&
                    (
                        <div
                            className="gap-2"
                            onClick={handleOpenPopup}>
                            <p className="text-lg font-bold">
                                ₹{formatNumberWithCommas(Listingdata[0]?.pricePerDay)}
                                <span className="text-sm font-medium">/night</span>

                            </p>
                            <p className="text-xs font-bold underline italic">
                                Pick Dates Here
                            </p>
                        </div>
                    )
                }


                <button

                    onClick={handleCreateBooking}
                    disabled={processing}
                    // href={`../details/${propertyId}/bookingconfirmation`}
                    className={` ${isPopupOpen ? "w-[90%]" : "w-[150px]"} red-gradient h-[40px] rounded-lg text-white font-bold hover:to-blue-100 z-30 flex justify-center items-center`}
                >
                    {
                        processing ? "Processing " :
                            "Reserve Now"
                    }
                </button>
            </div>
        </div>
    );
}
