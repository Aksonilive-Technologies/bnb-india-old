"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";

import DynamicSearchBar from "@/components/shared/searchbars/dynamicSearchBar";

import Filters from "../filters/filter";
import NavBarCategories from "./navbarCategories";
import PlaceholderProfileMenu from "./placeHolderProfileMenu";

const ProfileMenu = dynamic(() => import("./ProfileMenu"), {
  ssr: false,
  loading: () => <PlaceholderProfileMenu />,
});

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<any>({
    priceRange: [0, 100000],
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    amenities: [],
  });

  // const router = useRouter();
  useEffect(() => {
    // if (!router.isReady) return;

    const queryParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '/');

    const updatedFilters = { ...filters };

    // Parse priceRange if present
    const priceRange = queryParams.get("priceRange");
    if (priceRange) {
      const [min, max] = priceRange.split(",").map(Number);
      updatedFilters.priceRange = [min, max];
    }

    // Parse numeric filters
    const numericFilters = ["bedrooms", "bathrooms", "beds"];
    numericFilters.forEach((filter: any) => {
      const value = queryParams.get(filter);
      if (value) {
        updatedFilters[filter] = parseInt(value, 10);
      }
    });
    // Parse placeType
    const placeType = queryParams.get("placeType");
    if (placeType) {
      updatedFilters.placeType = placeType;
    }
    // Parse boolean filters
    const booleanFilters = ["family_only", "bnbVerified", "isListed"];
    booleanFilters.forEach((filter) => {
      const value = queryParams.get(filter);
      if (value) {
        updatedFilters[filter] = value === "true";
      }
    });

    const amenities: any = queryParams.get("amenities");


    if (amenities) {
      const amenitiesList = amenities.split("+");
      amenitiesList.forEach((amenity: any) => {
        // updatedFilters[amenity] = amenitiesList.includes(amenity);
        filters.amenities.push(amenity);
      });
    }
    // Set updated filters
    console.log("updated filter are", updatedFilters);
    setFilters(updatedFilters);
    // console.log(filters);
  }, []);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };
  const clearFilters = () => {
    setFilters({
      priceRange: [0, 100000],
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      amenities: [],
    });
    toggleModal();
  }
  const handleFilterChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setFilters((prevFilters: any) => {
      if (name === "amenities") {
        // Directly update the amenities array with the new values
        return {
          ...prevFilters,
          amenities: value,
        };
      }
      if (name === "placeType") {
        // Update the placeType filter
        return {
          ...prevFilters,
          placeType: value,
        };
      }

      return {
        ...prevFilters,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };


  // code to hide category bar 
  const [isVisible, setIsVisible] = useState(true);
  const [isNavbarFixed, setNavbarFixed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 120) {
        setNavbarFixed(true)
      }
      else {
        setNavbarFixed(false)
      }

      if (currentScrollY > lastScrollY) {
        // Scrolling Down
        setIsVisible(false);
      } else {
        // Scrolling Up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  //     pool: true,
  // //     pool: true,
  // const updateUrlWithFilters = (filters: any) => {
  //   const url = new URL(window.location.href);
  //   const params = new URLSearchParams(url.search);

  //   // Update numeric filters
  //   const numericFilters = ['bedrooms', 'bathrooms', 'beds'];
  //   numericFilters.forEach((filter) => {
  //     if (filters[filter] !== undefined) {
  //       params.set(filter, filters[filter]);
  //     }
  //   });

  //   // Update other filters
  //   const otherFilters = ['location', 'priceRange', 'propertyType'];
  //   otherFilters.forEach((filter) => {
  //     if (filters[filter] !== undefined) {
  //       params.set(filter, filters[filter]);
  //     }
  //   });

  //   // Update boolean amenities
  //   const booleanAmenities = [
  //     'pool', 'garden', 'wifi', 'staff', 'ac', 'chef', 'heater', 'kitchen', 'parking', 'snooker',
  //   ];
  //   const amenities = booleanAmenities.filter((amenity) => filters[amenity]);
  //   if (amenities.length > 0) {
  //     params.set('amenities', amenities.join('+'));
  //   }

  //   // Update the URL
  //   window.history.replaceState({}, '', `${url.pathname}?${params.toString()}`);
  // };

  return (
    <nav className="bg-white z-50 fixed top-0 w-full">
      <div className="bg-white shadow-sm py-2 px-4 flex justify-between items-start z-5">
        <Link
          href={"/"}
          className="text-lg mt-2 font-bold flex gap-2 items-center"
        >
          <Image src={"/logo.png"} alt="logo" width={30} height={30} />
          <p className="hidden lg:block pt-3 pb-0">bnbIndia</p>
        </Link>
        <div className="hidden md:block">
          <DynamicSearchBar />
        </div>
        <div className="mt-2">
          <ProfileMenu />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Grayish Background Overlay */}
          <div
            className="fixed inset-0 bg-gray-900 opacity-50"
            onClick={toggleModal}
          ></div>

          {/* Modal Content */}
          <div className=" h-[90vh]   shadow-lg w-[90%] md:w-[80vw]   lg:max-w-[550px]  relative ">
            {/* Filters Component */}
            <Filters
              filters={filters}
              toggleModal={toggleModal}
              handleFilterChange={handleFilterChange}
              onclearFilters={clearFilters}
            />
          </div>
        </div>
      )}
      <div
        className={`transition-all duration-700  z-[-5] ${isVisible ? "relative" : "absolute w-full translate-y-[-90px]"} 
              flex justify-center  items-center bg-white drop-shadow-sm px-10 md:gap-6`}
      >

        <NavBarCategories />
        <button
          onClick={toggleModal}
          className="border-2 hidden md:flex  items-center justify-center gap-2 border-gray-200 rounded-xl px-6 py-2"
        >
          <Image
            src={"/shared_icons/filter.png"}
            alt="logo"
            width={18}
            height={18}
          />
          <p>Filters</p>
        </button>
      </div>
    </nav>
  );
}
