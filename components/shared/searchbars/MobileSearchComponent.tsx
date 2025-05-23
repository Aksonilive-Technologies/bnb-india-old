'use client'

import React, { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import { addDays, format, set } from 'date-fns';
import { CalendarIcon, Search } from 'lucide-react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { FaCross, FaMapMarkerAlt, FaSearch, FaTimes } from 'react-icons/fa';
import { formatToYYYYMMDD } from '@/utils/formatTimeStamp';
import { fetchDistinctLocations } from '@/actions/listing/listing.action';
const MobileSearchComponent = () => {
  const [locationValue, setLocationValue] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      key: "selection",
    },
  ]);
  const [location, setLocation] = useState('');
  const [checkInDates, setCheckInDates] = useState<any>(new Date()); // Today's date
  const [checkOutDates, setCheckOutDates] = useState<any>(addDays(new Date(), 1));

  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [petsCount, setPetsCount] = useState(0);
  const [totalGuests, setTotalGuests] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [villaLocations, setVillaLocations] = useState<string[]>([]);


  // Handlers for incrementing and decrementing counts
  const incrementCount = (type: any) => {
    switch (type) {
      case 'adults':
        setAdultsCount((prev) => prev + 1);
        break;
      case 'children':
        setChildrenCount((prev) => prev + 1);
        break;
      case 'pets':
        setPetsCount((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  const decrementCount = (type: any) => {
    switch (type) {
      case 'adults':
        setAdultsCount((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'children':
        setChildrenCount((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'pets':
        setPetsCount((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      default:
        break;
    }
  };
  const onSelectDate = (ranges: any) => {
    const formattedStartDate = formatToYYYYMMDD(ranges.selection.startDate);
    var formattedEndDate = formatToYYYYMMDD(ranges.selection.endDate);

    if (formattedStartDate === formattedEndDate) {
      // Parse the formattedStartDate to create a Date object
      const startDateObj = new Date(ranges.selection.startDate);

      // Add one day
      startDateObj.setDate(startDateObj.getDate() + 1);

      // Format the new date
      formattedEndDate = formatToYYYYMMDD(startDateObj);
    }

    // const formattedDateRange = [formattedStartDate, formattedEndDate];
    // console.log([ranges.selection]);
    setSelectedDateRange([ranges.selection]);
    setCheckInDates(formattedStartDate)
    setCheckOutDates(formattedEndDate)
  };


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const locations = await fetchDistinctLocations();
        console.log(locations);

        setVillaLocations(locations); // Update state with fetched locations
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    // Fetch locations (if needed)
    fetchLocations()
  }, []);
  useEffect(() => {
    const filteredSuggestions = villaLocations
      .filter((item) =>
        item.toLowerCase().includes(location.toLowerCase())
      )
      .slice(0, 7);

    setSuggestions(filteredSuggestions);
  }, [location]);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isExpanded]);
  const explandRef = useRef<HTMLDivElement>(null);
  const [searchType, setSearchType] = useState('');
  return (
    <div
      className={` mx-auto z-[100] p-4 overflow-y-auto transition-all duration-800 ease-in-out ${isExpanded ? 'w-screen h-screen fixed top-0 ' : 'w-[90%] h-auto'
        }`}
    // onClick={handleClick}
    >


      {
        isExpanded ?

          <div className="fixed top-0 justify-between pt-[4vh] inset-0 transition-all duration-2000  bg-white z-[100] flex gap-3 py-2 ease-in-out  flex-col items-center">
            {/* Replace with actual search component */}

            <div className='w-full py-2 '>
              <div className="flex mt-5 justify-between items-center w-full pb-2 px-4 mb-4 ">
                <p className="font-semibold text-lg text-gray-800">
                  Find your perfect stay with ease.
                </p>
                <button
                  onClick={() => {
                    // setSearchType('Location');
                    setIsExpanded(false);
                  }}
                  className="text-gray-600 hover:text-red-500 transition duration-200">
                  <FaTimes size={20} />
                </button>
              </div>
              <div className='flex w-full h-full flex-col items-center justify-between'>
                <div className='w-[95%] gap-4 flex flex-col '>
                  <div className={`border-[1px] flex flex-col items-center justify-between w-full ${searchType === 'Location' ? 'bg-white shadow-lg' : 'bg-gray-200'} px-4 py-4 rounded-2xl transition-all duration-300`}>
                    <div
                      onClick={() => {
                        setSearchType('Location');
                      }}
                      className="flex w-full items-center justify-between cursor-pointer"
                    >
                      <label className="block text-xl h-auto font-semibold">Where to?</label>
                      <p className="text-gray-600">{location ? location : 'Anywhere'}</p>
                    </div>

                    {searchType === 'Location' && (
                      <div ref={explandRef} className="w-full relative mt-4">
                        <div className="flex items-center rounded-lg px-4 py-3 bg-white  border-[1px] border-gray-300">
                          <FaSearch className="text-gray-400 mr-2" />
                          <input
                            type="text"
                            placeholder="Search destinations"
                            className="bg-transparent w-full outline-none text-gray-800"
                            value={location === "Anywhere" ? "" : location}
                            onChange={(e) => setLocation(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Delayed to allow click event on suggestion
                          />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                          <ul className=" w-full mt-2 max-h-40 overflow-y-auto display-no-scroll bg-white border border-gray-200 rounded-lg ">
                            {suggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 transition-all duration-200"
                                onMouseDown={() => {
                                  setLocation(suggestion);
                                  setShowSuggestions(false);
                                  setSearchType('Date');
                                }}
                              >
                                <FaMapMarkerAlt className="mr-3 text-gray-500 text-lg" />
                                <span className="text-gray-700">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`border-[1px] flex flex-col items-center justify-between w-full ${searchType === 'Date' ? 'bg-white shadow-lg' : 'bg-gray-200'} px-4 py-4 rounded-2xl transition-all duration-300`}>
                    <div
                      onClick={() => {
                        setSearchType('Date');
                      }}
                      className="flex w-full items-center justify-between cursor-pointer"
                    >
                      <label className="block text-xl h-auto mt-2 font-semibold">When?</label>
                      <p className="text-gray-600">{checkInDates ? `${format(checkInDates, 'dd MMM')} - ${format(checkOutDates, 'dd MMM')}` : 'Any week'}</p>
                    </div>

                    {searchType === 'Date' && (
                      <div
                        ref={explandRef}
                        className="w-[90vw] mt-4 max-h-[350px] flex items-center justify-center rounded-lg overflow-hidden"
                      >
                        <div className="flex justify-center w-full"> {/* Wrapper to center the calendar */}
                          <DateRange
                            rangeColors={["#ccadb997"]}
                            ranges={selectedDateRange}
                            date={new Date()}
                            onChange={onSelectDate}
                            direction="vertical"
                            showDateDisplay={false}
                            minDate={new Date()}
                            months={1}
                            className="custom-date-range"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className={`border-[1px] flex flex-col items-center justify-between w-full ${searchType === 'count' ? 'bg-white shadow-lg' : 'bg-gray-200'} px-4 py-4 rounded-2xl transition-all duration-300`}>
                    <div
                      onClick={() => {
                        setSearchType('count');
                      }}
                      className="flex w-full items-center justify-between cursor-pointer"
                    >
                      <label className="block text-xl h-auto mt-2 font-semibold">Who ?</label>
                      <p className="text-gray-600">{adultsCount + childrenCount  > 1 ? adultsCount + childrenCount + " Guests" : adultsCount + childrenCount  + " Guest"}</p>
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


                      </div>
                    )}
                  </div>
                </div>


              </div>
            </div>

            <Link
              href={{
                pathname: "/",
                query: {
                  location: location || "Anywhere",
                  checkin: selectedDateRange[0]?.startDate
                    ? format(new Date(selectedDateRange[0].startDate), "yyyy-MM-dd")
                    : "",
                  checkout: selectedDateRange[0]?.endDate
                    ? format(new Date(selectedDateRange[0].endDate), "yyyy-MM-dd")
                    : "",
                  adults: adultsCount,
                  children: childrenCount,
                  pets: petsCount,
                  totalGuests: adultsCount + childrenCount ,
                },
              }}

              className='w-full px-2'
            >
              <div className="h-[50px] w-full flex cursor-pointer items-center justify-center">
                <div className="red-gradient flex justify-center items-center h-full w-full lg:hidden rounded-2xl">
                  <p className="text-xl text font-bold text-white">Search</p>
                </div>
                <div className="red-gradient h-[60px] w-[65px] rounded-xl p-3 hidden lg:block">
                  <Search className="w-full h-full text-white" />
                </div>
              </div>
            </Link>
          </div> :

          <div className="mx-auto w-full rounded-3xl bg-white shadow-lg">
            <div className="flex flex-col lg:flex-row mx-auto p-3 gap-3">
              {/* Location Section */}
              <div
                onClick={() => {
                  setSearchType('Location');
                  setIsExpanded(true);
                }}
                className="h-[60px] bg-[#fbf7f7] flex-grow justify-start border-2 border-gray-300 px-3 pt-1 sm:pt-2 rounded-2xl lg:rounded-none"
              >
                <p className="flex self-start text-[1rem] font-bold">Location</p>
                <p className="text-gray-600">{location || "Anywhere"}</p>
              </div>

              {/* Checkin - Checkout Section */}
              <div
                onClick={() => {
                  setSearchType('Date');
                  setIsExpanded(true);
                }}
                className="h-[60px] lg:h-full lg:max-w-[500px] bg-[#fbf7f7] flex-grow justify-start border-2 lg:border-0 lg:border-r-2 border-gray-300 px-3 pt-1 sm:pt-2 lg:pt-0 rounded-2xl lg:rounded-none"
              >
                <p className="flex self-start text-[1rem] font-bold">Checkin - Checkout</p>
                <p className="text-gray-600">
                  {checkInDates && checkOutDates
                    ? `${format(new Date(checkInDates), "LLL dd")} - ${format(
                      new Date(checkOutDates),
                      "LLL dd"
                    )}`
                    : "Add dates"}
                </p>
              </div>

              {/* Guests Section */}
              <div
                onClick={() => {
                  setSearchType('count');
                  setIsExpanded(true);
                }}
                className="h-[60px] lg:h-full bg-[#fbf7f7] flex-grow justify-start px-3 border-2 lg:border-none pt-1 sm:pt-2 lg:pt-0 rounded-2xl border-gray-300"
              >
                <p className="flex self-start text-[1rem] font-bold">Add Guests</p>
                <p className="text-gray-600">
                  {totalGuests > 1 ? `${totalGuests} Guests` : `${totalGuests || 1} Guest`}
                </p>
              </div>

              {/* Search Button */}
              <Link
                href={{
                  pathname: "/",
                  query: {
                    location: location || "Anywhere",
                    checkin: selectedDateRange[0]?.startDate
                      ? format(new Date(selectedDateRange[0].startDate), "yyyy-MM-dd")
                      : "",
                    checkout: selectedDateRange[0]?.endDate
                      ? format(new Date(selectedDateRange[0].endDate), "yyyy-MM-dd")
                      : "",
                    adults: adultsCount,
                    children: childrenCount,
                    pets: petsCount,
                    totalGuests: adultsCount + childrenCount ,
                  },
                }}
              >
                <div className="h-[50px] flex cursor-pointer items-center justify-center">
                  <div className="red-gradient flex justify-center items-center h-full w-full lg:hidden rounded-2xl">
                    <p className="text-xl text font-bold text-white">Search</p>
                  </div>
                  <div className="red-gradient h-[60px] w-[65px] rounded-xl p-3 hidden lg:block">
                    <Search className="w-full h-full text-white" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
      }

    </div>
  );
};

export default MobileSearchComponent;

