"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-date-range";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import DropdownSearchBar from "../dropdownSearchBar";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import { useRouter } from "next/navigation";

import { FaSearch } from "react-icons/fa";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DynamicSearchBar() {
  const [location, setLocation] = useState("locating...");

  // const [filters, setFilters] = useState<any>({
  //   category: "",
  //   priceRange: [0, 100000],
  //   bedrooms: 0,
  //   beds: 0,
  //   bathrooms: 0,
  // });

  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);

  useLayoutEffect(() => {
    const currentUrl = new URL(
      typeof window !== "undefined" ? window.location.href : "/",
    );
    const query = new URLSearchParams(currentUrl.search);

    const locationFromUrl = query.get("location") || "Anywhere";
    const checkin =
      query.get("checkin") || new Date().toISOString().split("T")[0]; // Default to today
    let checkout =
      query.get("checkout") ||
      new Date(Date.now() + 86400000).toISOString().split("T")[0]; // Default to tomorrow
    const guestCount: number = Number(query.get("totalGuests")) || 1;
    const adultsCount: number = Number(query.get("adults")) || 1;
    const childrenCount: number = Number(query.get("children")) || 0;
    const petsCount: number = Number(query.get("pets")) || 0;

    setAdultsCount(adultsCount);
    setChildrenCount(childrenCount);
    setPetsCount(petsCount);

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit", // Valid options: '2-digit', 'numeric'
      month: "short", // Valid options: 'numeric', '2-digit', 'long', 'short', 'narrow'
    };

    setLocation(locationFromUrl);
    setTotalGuests(guestCount);
    // Parse check-in and check-out dates
    if (checkin) {
      const checkinDate = new Date(checkin);

      if (!checkout) {
        const defaultCheckoutDate = new Date(checkinDate);
        defaultCheckoutDate.setDate(defaultCheckoutDate.getDate() + 1); // Add 1 day
        checkout = defaultCheckoutDate.toISOString().split("T")[0]; // Set the default checkout
      }

      const checkoutDate = new Date(checkout);

      if (!isNaN(checkinDate.getTime()) && !isNaN(checkoutDate.getTime())) {
        setSelectedDateRange([
          {
            startDate: checkinDate,
            endDate: checkoutDate,
            key: "selection",
          },
        ]);
        console.log(
          "dates",
          checkinDate.toLocaleDateString("en-US", options),
          checkoutDate.toLocaleDateString("en-US", options),
        );
      } else if (!isNaN(checkinDate.getTime())) {
        setSelectedDateRange([
          {
            startDate: checkinDate,
            endDate: checkinDate,
            key: "selection",
          },
        ]);
        console.log(
          "dates",
          checkinDate.toLocaleDateString("en-US", options),
          checkinDate.toLocaleDateString("en-US", options),
        );
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Handle click outside to close search bar
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
    // const year = date.getFullYear();

    return `${day} ${monthName} `;
  };

  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const onSelectDate = (ranges: any) => {

    const { startDate, endDate } = ranges.selection;

    // Ensure endDate is always greater than startDate
    // const adjustedEndDate =
    //   startDate >= endDate
    //     ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // Add one day in milliseconds
    //     : endDate;

    // setSelectedDateRange([
    //   {
    //     ...ranges.selection,
    //     startDate: startDate,
    //     endDate: adjustedEndDate,
    //   },
    // ]);
    setSelectedDateRange([ranges.selection]);
  };

  const [searchBarActive, setSearchBarActive] = useState(false);

  const handleClickOutside = (event: any) => {
    const searchBarElement = event.target.closest(".dynamic-search-bar");
    const excludeElement = event.target.closest(".exclude-class");

    if (!searchBarElement && !excludeElement) {
      // Click is outside both the search bar and the exclude class
      setSearchBarActive(false);
    } else if (searchBarElement) {
      // Click is inside the search bar, keep it active
      setSearchBarActive(true);
    }
  };

  // Ensure to add the event listener in the appropriate lifecycle method
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const router = useRouter();

  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY !== lastScrollY) {
        setSearchBarActive(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchBarActive]);

  const isMobile = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      return screenWidth < 640; // Adjust this breakpoint as needed
    }
    return false;
  };

  const incrementCount = (type: string) => {
    switch (type) {
      case "adults":
        setTotalGuests(totalGuests + 1);
        setAdultsCount(adultsCount + 1);
        break;
      case "children":
        setChildrenCount(childrenCount + 1);
        setTotalGuests(totalGuests + 1);
        break;
      case "pets":
        setPetsCount(petsCount + 1);
        // setTotalGuests(totalGuests + 1);
        break;
      default:
        break;
    }
  };

  const decrementCount = (type: string) => {
    switch (type) {
      case "adults":
        if (adultsCount > 0) {
          setAdultsCount(adultsCount - 1);
          setTotalGuests(Math.max(totalGuests - 1, 0));
        }
        break;
      case "children":
        if (childrenCount > 0) {
          setChildrenCount(childrenCount - 1);
          setTotalGuests(Math.max(totalGuests - 1, 0));
        }
        break;
      case "pets":
        if (petsCount > 0) {
          setPetsCount(petsCount - 1);
        }
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    setSearchBarActive(false);
    console.log(searchBarActive);
    const Location = location ? location.trim() : "Anywhere";
    const checkInDates =
      selectedDateRange[0]?.startDate?.toDateString() || "Any week";
    const checkOutDates =
      selectedDateRange[0]?.endDate?.toDateString() || "Any week";
    const totalGuestsCount = adultsCount + childrenCount + petsCount;
    const searchURL = `/?location=${Location}&checkin=${checkInDates}&checkout=${checkOutDates}&adults=${adultsCount}&children=${childrenCount}&pets=${petsCount}&totalGuests=${totalGuestsCount}`;
    router.push(searchURL);
  };

  const [searchModal, setSearchModal] = useState("");

  const handleDateSelect = (ranges: any) => {
    onSelectDate(ranges); // Update the selected date range
  };


  return (
    <div className="dynamic-search-bar bg-white rounded-b-[50px] w-auto min-w-[min-content] p-2  sm:max-w-full flex flex-col items-center transition-all duration-500 ">
      {searchBarActive ? (
        <p className="text-lg font-semibold">
          Find your perfect stay with ease.
        </p>
      ) : null}
      <div
        onClick={handleClickOutside}
        className={`w-full px-4 rounded-2xl flex flex-col justify-center items-center transition-all duration-500 ${searchBarActive ? "h-32" : "h-12"}`}
      >
        {/* {searchBarActive && (
          <div className="mt-1 mb-3  w-[40%] flex justify-between  text-center">
            <button className="w-full py-2 font-bold text-gray-900 hover:text-pink-500 transition-colors">
              Stays
            </button>
            <button className="w-full py-2 font-bold text-gray-900 hover:text-pink-500 transition-colors">
              Nearby Places
            </button>
          </div>
        )} */}

        {searchBarActive ? (
          <div className="exclude-class shadow-md w-[75vw]  lg:w-[62vw] lg:min-w-[700px] max-w-[1000px] h-[70px] flex flex-row items-center justify-between border border-gray-200 rounded-full">
            <div className="w-full">
              <div className="flex flex-row items-center justify-between">
                {/* Where section */}
                <div
                  onClick={() => setSearchModal("location")}
                  className={`cursor-pointer w-[150px] lg:w-[200px] h-[54px] px-2 lg:px-8 m-2 flex flex-col justify-center rounded-full hover:bg-opacity-70 ${searchModal === "location" ? "bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white" : "hover:bg-[#ffffff] hover:bg-opacity-80 "}`}
                >
                  <p className="text-sm font-bold">Where</p>
                  <div className=" exlude-class">
                    <DropdownSearchBar
                      locationValue={location === "Anywhere" ? "" : location}
                      setLocationValue={setLocation}
                      setSearchModal={setSearchModal}
                    />
                  </div>
                </div>

                {/* Check in section */}
                <div
                  onClick={() => setSearchModal("checkin")}
                  className={`cursor-pointer h-[54px] px-2 lg:px-6  py-2 m-2 flex flex-col  rounded-full ${searchModal === "checkin" ? "bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)]  hover:bg-white" : " hover:bg-[#ffffff] hover:bg-opacity-80 "} `}
                >
                  <p className="text-sm font-bold">Check in</p>
                  <Popover open={searchModal === "checkin"}>
                    <PopoverTrigger asChild>
                      <div
                        id="date"
                        className={cn(
                          "w-full  text-gray-600 justify-start flex flex-row items-center text-[1rem] font-normal border-none p-0 bg-transparent ",
                          !selectedDateRange && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDateRange[0].startDate ? (
                          <p className="w-auto whitespace-nowrap">
                            {format(
                              selectedDateRange[0].startDate,
                              "LLL dd, y",
                            )}
                          </p>
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto mt-5 exclude-class bg-white p-3  rounded-3xl flex justify-center">
                      {/* <div className=''> */}
                      <DateRange
                        rangeColors={["#332937"]}
                        ranges={selectedDateRange}
                        date={new Date()}
                        // onChange={onSelectDate}
                        onChange={handleDateSelect}
                        direction="horizontal"
                        showDateDisplay={false}
                        // showSelectionPreview={false}
                        minDate={new Date()}
                        months={isMobile() ? 1 : 2}
                        className="datepicker"
                      />
                      {/* </div> */}
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Check out section */}
                <div
                  onClick={() => setSearchModal("checkout")}
                  className={`cursor-pointer h-[54px] px-2 md:px-6  py-2 m-2 flex flex-col rounded-full ${searchModal === "checkout" ? "bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white" : "hover:bg-[#ffffff] hover:bg-opacity-80 "} `}
                >
                  <p className="text-sm font-bold">Check out</p>
                  <div className={"mt-1" + cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <div
                          id="date"
                          className={cn(
                            "w-full text-gray-600 justify-start flex flex-row items-center text-left text-[1rem] font-normal border-none p-0 bg-transparent ",
                            !selectedDateRange && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDateRange[0].endDate ? (
                            <p className="w-auto whitespace-nowrap">
                              {format(
                                selectedDateRange[0].endDate,
                                "LLL dd, y",
                              )}
                            </p>
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto mt-5 bg-white p-3 exclude-class  rounded-3xl flex justify-center">
                        <DateRange
                          rangeColors={["#332937"]}
                          ranges={selectedDateRange}
                          date={new Date()}
                          // onChange={onSelectDate}
                          onChange={handleDateSelect}
                          direction="horizontal"
                          showDateDisplay={false}
                          // showSelectionPreview={false}
                          minDate={new Date()}
                          months={isMobile() ? 1 : 2}
                          className="datepicker"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Who section */}
                <div
                  onClick={() => setSearchModal("guests")}
                  className={`cursor-pointer relative w-[30%]  gap-[10px] h-full px-2 md:px-6  py-2 m-2 flex flex-row justify-between items-center rounded-full ${searchModal === "guests" ? "bg-white shadow-[0_3px_10px_rgb(0,0,0,0.2)] hover:bg-white" : "hover:bg-[#ffffff] hover:bg-opacity-80 "} `}
                >
                  <div className="" onClick={() => setSearchModal("guests")}>
                    <p
                      onClick={() => setSearchModal("guests")}
                      className="text-sm w-full font-bold"
                    >
                      Who
                    </p>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div
                          // variant="outline"
                          className="w-full   flex flex-col items-center justify-start border-none p-0 text-left text-[1rem] font-normal text-gray-600 bg-transparent"
                        >
                          {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mt-5 exclude-class  p-4 rounded-3xl ">
                        <div className="mb-4 px-2 py-1 md:w-[400px] flex-row flex items-center justify-between border-gray-200">
                          <div className="flex items-center flex-col justify-between mb-2">
                            <span className="text-gray-900 font-semibold text-lg w-full text-left">
                              Adults
                            </span>
                            <span className="text-sm text-gray-500">
                              Ages 13 or above
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => decrementCount("adults")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                              </Button>
                              <span className="text-md font-medium text-gray-700">
                                {adultsCount}
                              </span>
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => incrementCount("adults")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="mb-4 px-2 py-1 md:w-[400px]  flex-row flex items-center justify-between  border-gray-200">
                          <div className="flex items-center flex-col justify-between mb-2">
                            <span className="text-gray-900 font-semibold text-lg  w-full text-left">
                              Children
                            </span>
                            <span className="text-sm text-gray-500">
                              Ages 2–12
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => decrementCount("children")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                              </Button>
                              <span className="text-md font-medium text-gray-700">
                                {childrenCount}
                              </span>
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => incrementCount("children")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className=" px-2 py-1 md:w-[400px]  flex-row flex items-center justify-between  border-gray-200">
                          <div className="flex items-center flex-col justify-between mb-2">
                            <span className="text-gray-900 font-semibold text-lg  w-full text-left">
                              Pets
                            </span>
                            <span className="text-sm text-gray-500">
                              Bringing a service animal?
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => decrementCount("pets")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlineMinus className="h-5 w-5 text-gray-600" />
                              </Button>
                              <span className="text-md font-medium text-gray-700">
                                {petsCount}
                              </span>
                              <Button
                                size="lg"
                                variant="outline"
                                onClick={() => incrementCount("pets")}
                                className="p-3 rounded-full border border-gray-300"
                              >
                                <AiOutlinePlus className="h-5 w-5 text-gray-600" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {/* <DropdownMenuSeparator /> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <button
                    onClick={handleSearch}
                    className="absolute right-0 z-50 cursor-pointer h-14 min-w-14 my-auto flex items-center justify-center rounded-full gap-2 px-5 red-gradient"
                  >
                    <FaSearch className="text-white w-4 h-4" />
                    {searchModal != "" ? (
                      <p className="text-white font-bold hidden lg:block">
                        Search
                      </p>
                    ) : null}
                  </button>
                </div>

                {/* Search button */}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white text-md flex justify-between items-center shadow-sm hover:shadow-md rounded-full py-2 transition-all duration-500 border w-full">
            <div className="flex justify-center items-center cursor-pointer px-4 h-full border-r-2">
              <div className="text-gray-900 font-semibold">{location}</div>
            </div>
            <div className="sm:flex justify-center items-center cursor-pointer px-4 h-full border-r-2">
              <div className="text-gray-900 font-semibold">{`${formatToYYYYMMDD(selectedDateRange[0].startDate)} - ${formatToYYYYMMDD(selectedDateRange[0].endDate)}`}</div>
            </div>
            <div className=" sm:flex justify-center items-center cursor-pointer px-4 h-full">
              <div className="text-gray-900 font-semibold">
                {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
              </div>
            </div>
            <div className="flex items-center justify-center w-9 h-9 red-gradient text-white rounded-full mr-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
