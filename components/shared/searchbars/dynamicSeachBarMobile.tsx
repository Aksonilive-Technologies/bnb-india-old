'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchDistinctLocations } from '@/actions/listing/listing.action';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import NavBarCategories from '../navbar/navbarCategories';
import Filters from '../filters/filter';
import { addDays, format, isValid, parseISO } from 'date-fns';



export default function DynamicSearchBarMobile() {
    const [location, setLocation] = useState('');
    const [checkInDates, setCheckInDates] = useState('');
    const [checkOutDates, setCheckOutDates] = useState('');

    const [adultsCount, setAdultsCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [petsCount, setPetsCount] = useState(0);
    const [totalGuests, setTotalGuests] = useState(1);
    // Handle click outside to close search bar
    const formatToYYYYMMDD = (date: any) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
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

    const [searchBarActive, setSearchBarActive] = useState(false);


    const [isOpen, setIsOpen] = useState(false);
    // const toggleModal = () => {
    //     setIsOpen(!isOpen);
    // };
    const [isFilter, setIsFilter] = useState(false);
    const toggleFilter = () => {
        setIsFilter(!isFilter);
    }


    const router = useRouter();



    const isMobile = () => {
        if (typeof window !== 'undefined') {
            const screenWidth = window.innerWidth;
            return screenWidth < 640; // Adjust this breakpoint as needed
        }
        return false;
    };

    const incrementCount = (type: string) => {
        switch (type) {
            case 'adults':
                setTotalGuests(totalGuests + 1);
                setAdultsCount(adultsCount + 1);
                break;
            case 'children':
                setChildrenCount(childrenCount + 1);
                setTotalGuests(totalGuests + 1);
                break;
            case 'pets':
                setPetsCount(petsCount + 1);
                // setTotalGuests(totalGuests + 1);
                break;
            default:
                break;
        }
    };

    const decrementCount = (type: string) => {
        switch (type) {
            case 'adults':
                if (adultsCount > 0) {
                    setAdultsCount(adultsCount - 1);
                    setTotalGuests(Math.max(totalGuests - 1, 0));
                }
                break;
            case 'children':
                if (childrenCount > 0) {
                    setChildrenCount(childrenCount - 1);
                    setTotalGuests(Math.max(totalGuests - 1, 0));
                }
                break;
            case 'pets':
                if (petsCount > 0) {
                    setPetsCount(petsCount - 1);
                }
                break;
            default:
                break;
        }
    };

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [villaLocations, setVillaLocations] = useState<string[]>([]);
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

    useLayoutEffect(() => {


        // Early return if window is undefined (for SSR compatibility)
        if (typeof window === 'undefined') return;

        const currentUrl = new URL(window.location.href);
        const query = new URLSearchParams(currentUrl.search);

        // Extract query parameters with defaults
        const locationFromUrl = query.get('location') || 'Anywhere';
        const adultsCount = Number(query.get('adults')) || 1;
        const childrenCount = Number(query.get('children')) || 0;
        const petsCount = Number(query.get('pets')) || 0;
        const guestCount = Number(query.get('totalGuests')) || 1;

        // Set state for non-date values
        setLocation(locationFromUrl);
        setAdultsCount(adultsCount);
        setChildrenCount(childrenCount);
        setPetsCount(petsCount);
        setTotalGuests(guestCount);

        // Date handling with date-fns
        const today = new Date();
        const tomorrow = addDays(today, 1);

        const checkinParam = query.get('checkin');
        const checkoutParam = query.get('checkout');

        // Parse dates using date-fns
        let checkinDate = checkinParam ? new Date(checkinParam) : new Date();
        let checkoutDate = checkoutParam ? new Date(checkOutDates) : tomorrow;


        console.log(checkInDates, checkOutDates);

        // Validate dates
        if (!isValid(checkinDate)) checkinDate = today;
        if (!isValid(checkoutDate)) checkoutDate = tomorrow;

        // Ensure checkout is after checkin
        if (checkoutDate <= checkinDate) {
            checkoutDate = addDays(checkinDate, 1);
        }

        // Format dates for display using date-fns
        const formatDate = (date: Date) => format(date, 'dd MMM'); // e.g., "13 Feb"

        setCheckInDates(formatDate(checkinDate));
        setCheckOutDates(formatDate(checkoutDate));

        // Set selected date range
        setSelectedDateRange([
            {
                startDate: checkinDate,
                endDate: checkoutDate,
                key: 'selection',
            },
        ]);

        // Log formatted dates
        console.log('dates', format(checkinDate, 'dd MMM'), format(checkoutDate, 'dd MMM'));

        ;
    }, []);

    useEffect(() => {
        const filteredSuggestions = villaLocations
            .filter((item) =>
                item.toLowerCase().includes(location.toLowerCase())
            )
            .slice(0, 7);

        setSuggestions(filteredSuggestions);
    }, [location]);

    const handleSearch = () => {
        const Location = location.trim();
        const checkInDates = selectedDateRange[0]?.startDate?.toDateString() || 'Any week';
        const checkOutDates = selectedDateRange[0]?.endDate?.toDateString() || 'Any week';
        const totalGuestsCount = adultsCount + childrenCount + petsCount;
        const searchURL = `/listings?location=${Location}&checkin=${checkInDates}&checkout=${checkOutDates}&adults=${adultsCount}&children=${childrenCount}&pets=${petsCount}&totalGuests=${totalGuestsCount}`;
        setSearchBarActive(false);
        router.push(searchURL);
    };

    const [searchType, setSearchType] = useState('');

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
        <div className="dynamic-search-bar z-[100] w-full min-w-[min-content] flex flex-col items-center transition-all duration-500">
            <div
                // onClick={handleClickOutside}
                className={`w-full rounded-2xl flex flex-col justify-center items-center transition-all duration-500 relative ${searchBarActive ? 'h-[100vh]' : 'h-12'
                    }`}
            >
                {searchBarActive ? (
                    <div className="fixed top-[0vh]  pt-[4vh] inset-0 w-full h-full bg-white z-[110] flex gap-3  flex-col items-center">
                        {/* Replace with actual search component */}
                        <div className="flex justify-between w-[80%] pb-2 mb-4">
                            <button className="font-semibold  border-black pb-2">Find your perfect stay with ease.</button>
                            {/* <button className="text-gray-500">Experiences</button> */}


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
                                        <p className="text-gray-600">{checkInDates ? `${checkInDates} - ${checkOutDates}` : 'Any week'}</p>
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
                                                    // disabledDates={disabledDatesUI}
                                                    minDate={new Date()}
                                                    months={isMobile() ? 1 : 2}
                                                    className="custom-date-range" // Add a custom class for styling
                                                // style={{ width: '100%' }} // Ensure it takes full width
                                                // dayContentRenderer={dayContentRenderer}
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
                                        <p className="text-gray-600">{totalGuests > 1 ? totalGuests + " Guest" : totalGuests + " Guests"}</p>
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
                            </div>
                            <div className='flex border-t-[1px] w-full rounded-b-[15px] justify-between p-8 py-4 shadow-t-lg
                         bg-white items-center '>
                                <button
                                    className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none `}
                                    onClick={() => {
                                        console.log("clear filters");
                                        setSearchBarActive(false);
                                    }} // Ensure to define the onClearFilters function
                                >
                                    Close
                                </button>
                                <button
                                    className={`px-4 py-2 red-gradient  text-gray-100 rounded-md  focus:outline-none  `}
                                    onClick={handleSearch} // Ensure to define the onApplyFilters function
                                >
                                    Apply
                                </button>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex items-center px-2 h-[7vh]  my-6 gap-2 justify-between w-full">

                        <div
                            onClick={() => {
                                setSearchBarActive(true);
                            }}
                            className="bg-white px-3 py-2 h-full gap-2 flex items-center shadow-sm hover:shadow-md rounded-xl transition-all duration-500 border w-full max-w-2xl mx-auto cursor-pointer"
                            aria-label="Search bar"
                        >
                            {/* Search Icon */}
                            <div className="flex items-center">
                                <FaSearch className="text-gray-400 text-lg" /> {/* Reduced icon size */}
                            </div>

                            {/* Location, Date, and Guests */}
                            <div className="flex flex-col flex-grow px-3">
                                {/* Location Section */}
                                <div className="flex items-center">
                                    <div className="text-gray-900 font-semibold text-md"> {/* Reduced font size */}
                                        {location || "Anywhere"}
                                    </div>
                                </div>

                                {/* Date and Guests Section */}
                                <div className="flex items-center text-gray-500 space-x-2">
                                    <div className="font-medium text-sm"> {/* Reduced font size */}
                                        {checkInDates || "from"} - {checkOutDates || "to"}
                                    </div>
                                    <span className="text-gray-400">|</span>
                                    <div className="font-medium text-sm"> {/* Reduced font size */}
                                        {totalGuests} {totalGuests === 1 ? 'Guest' : 'Guests'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Filter Button (Visible on Mobile Only) */}
                        <button
                            onClick={toggleFilter}
                            className="border-2 bg-white flex lg:hidden items-center justify-center border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
                            <Image src="/shared_icons/filter.png" alt="Filter" width={18} height={18} />
                        </button>


                    </div>
                )}
            </div>
            <div className='pt-2'>
            <NavBarCategories />
            </div>

            {isFilter && (
                <div className="fixed top-0 h-full w-full bg-white  inset-0 z-50 flex items-center justify-center">
                    {/* Grayish Background Overlay */}
                    {/* <div className="fixed inset-0 bg-gray-900 opacity-50" onClick={toggleModal}></div> */}

                    {/* Modal Content */}
                    <div className=" h-full   shadow-lg w-full ">
                        {/* Filters Component */}
                        <Filters
                            toggleModal={toggleFilter}

                        />
                    </div>
                </div>

            )}
        </div>





    );
}


