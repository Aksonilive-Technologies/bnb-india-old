"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-date-range";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DropdownSearchBar from "../dropdownSearchBar";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import React from "react";

import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Location {
  id: string;
  name: string;
}

interface SearchBarProps {
  isNotHomapage?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isNotHomapage }) => {
  //  set date range
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(), // Default check-in: today's date
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default check-out: next day
      key: "selection",
    },
  ]);
  

  const [popoverOpen, setPopoverOpen] = useState(false);


 // Ensure onSelectDate is declared only once
 const onSelectDate = (ranges: any) => {
  const { startDate, endDate } = ranges.selection;

  // Ensure endDate is always greater than startDate
  const adjustedEndDate =
    startDate >= endDate
      ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) // Add one day in milliseconds
      : endDate;

  setSelectedDateRange([
    {
      ...ranges.selection,
      startDate: startDate,
      endDate: adjustedEndDate,
    },
  ]);
};


  const isMobile = () => {
    if (typeof window !== "undefined") {
      const screenWidth = window.innerWidth;
      return screenWidth < 640; // Adjust this breakpoint as needed
    }
    return false;
  };

  // Add guest logics
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);
  const [totalGuests, setTotalGuests] = useState("1 guest");

  // Update total guests whenever any count changes
  useEffect(() => {
    const formattedGuestsString = formatGuestsString();
    setTotalGuests(formattedGuestsString);
  }, [adultsCount, childrenCount, petsCount]);

  // const [open, setOpen] = useState(false)
  const [locationValue, setLocationValue] = useState("");

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

  const formatGuestsString = () => {
    const guestsArray = [];
    if (adultsCount > 0) {
      guestsArray.push(`${adultsCount} adult${adultsCount !== 1 ? "s" : ""}`);
    }
    if (childrenCount > 0) {
      guestsArray.push(
        `${childrenCount} child${childrenCount !== 1 ? "ren" : ""}`,
      );
    }
    if (petsCount > 0) {
      guestsArray.push(`${petsCount} pet${petsCount !== 1 ? "s" : ""}`);
    }

    // If all counts are zero, display "1 guest"
    if (guestsArray.length === 0) {
      guestsArray.push("1 guest");
    }

    return guestsArray.join(", ");
  };

  // const handleClick = (e : any) => {
  //   e.preventDefault();

  //   setTimeout(() => {
  //     // const { locationValue, date, adultsCount, childrenCount, petsCount } = getValues(); // Assume getValues() fetches the necessary values
  //     if (typeof window !== 'undefined') {
  //       window.location.href = `/listings?location=${locationValue}&checkin=${selectedDateRange[0].startDate.toDateString()}&checkout=${selectedDateRange[0].endDate.toDateString()}&adults=${adultsCount}&children=${childrenCount}&pets=${petsCount}`;

  //     }
  //   }, 0);
  // };

  // Use a small timeout to ensure state update before navigation

  return (
    <>
      <div
        className={
          isNotHomapage
            ? `mx-auto w-full rounded-3xl  bg-white py-6 lg:py-2 lg:p-2 shadow-lg`
            : `mx-auto max-w-[1600px] flex w-[86%] sm:w-[70%] lg:w-[90%] xl:w-[75%] rounded-3xl lg:rounded-2xl bg-white py-6 lg:py-2 lg:p-2 shadow-md`
        }
      >
        <div className="flex flex-col lg:flex-row lg:h-[80px] w-[98%]  p-3 lg:p-2  gap-4 lg:gap-0">
          <div className="h-[60px] lg:h-full bg-[#fbf7f7] lg:bg-transparent flex-grow justify-start border-2 lg:border-0 lg:border-r-2 border-gray-300 px-3 pt-1 sm:pt-2 lg:pt-0 rounded-2xl lg:rounded-none">
            <p className="flex self-start text-[1rem] font-bold">Location</p>
            <div className="w-full border-none p-0 text-left text-[1rem] font-normal text-gray-400">
              <DropdownSearchBar
                locationValue={locationValue === "Anywhere" ? "" : locationValue}
                setLocationValue={setLocationValue}
              />
            </div>
          </div>
          <div className="h-[60px] lg:h-full lg:max-w-[500px] bg-[#fbf7f7] lg:bg-transparent flex-grow justify-start border-2 lg:border-0 lg:border-r-2 border-gray-300 px-3 pt-1 sm:pt-2 lg:pt-0 rounded-2xl lg:rounded-none">
            <p className="flex self-start text-[1rem] font-bold">
              Checkin - Checkout
            </p>
            <div className={cn("grid gap-2")}>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    id="date"
                    // variant={"outline"}
                    className={cn(
                      "w-full flex items-center text-gray-400 justify-start text-left text-[1rem] font-normal border-none p-0 bg-transparent ",
                      !selectedDateRange && "text-muted-foreground",
                    )}

                    onClick={() => setPopoverOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDateRange[0].startDate ? (
                      selectedDateRange[0].endDate ? (
                        <>
                          {format(selectedDateRange[0].startDate, "LLL dd, y")}{" "}
                          - {format(selectedDateRange[0].endDate, "LLL dd, y")}
                        </>
                      ) : (
                        format(selectedDateRange[0].startDate, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </button>
                </PopoverTrigger>

                {popoverOpen && (
                  <div
                    className="fixed inset-0  bg-black bg-opacity-10 z-40"
                    onClick={() => setPopoverOpen(false)} // Close on click
                  ></div>
                )}
                <PopoverContent 
                className="w-auto p-0 flex justify-center"
                >
                  <DateRange
                    rangeColors={["#262626"]}
                    ranges={selectedDateRange}
                    date={new Date()}
                    onChange={onSelectDate}
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
          {popoverOpen && (
                  <div
                    className="fixed inset-0  bg-black bg-opacity-50 md:bg-opacity-10 z-40"
                    onClick={() => setPopoverOpen(false)} // Close on click
                  ></div>
                )}
          <div className="h-[60px] lg:h-full bg-[#fbf7f7] lg:bg-transparent flex-grow justify-start px-3 border-2 lg:border-none pt-1 sm:pt-2 lg:pt-0 rounded-2xl border-gray-300">
            <p className="flex self-start text-[1rem] font-bold">Add Guests</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full justify-start  p-0 text-left text-[1rem] font-normal text-gray-400 "
                  onClick={() => setPopoverOpen(true)}
                >
                  {totalGuests}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
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
                    <span className="text-sm text-gray-500">Ages 2–12</span>
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
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Link
            href={{
              pathname: "/listings",
              query: {
                location: locationValue ? locationValue : "Anywhere",
                checkin: selectedDateRange[0].startDate.toDateString(),
                checkout: selectedDateRange[0].endDate.toDateString(),
                adults: adultsCount,
                children: childrenCount,
                pets: petsCount,
                totalGuests: adultsCount + childrenCount + petsCount,
              },
            }}
          >
            <div className="h-[50px] flex lg:h-full cursor-pointer  items-center justify-center lg:justify-end ">
              <div className="red-gradient flex justify-center items-center h-full w-[90%] p-6 lg:hidden rounded-2xl">
                {" "}
                <p className="text-xl text font-bold text-white">Search</p>{" "}
              </div>
              <div className="red-gradient h-[60px] w-[65px] rounded-xl p-3 hidden lg:block">
                <Search className="w-full h-full text-white" />{" "}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SearchBar;

interface IconProps extends React.SVGProps<SVGSVGElement> {}

function MinusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function PlusIcon(props: IconProps) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export { MinusIcon, PlusIcon };
