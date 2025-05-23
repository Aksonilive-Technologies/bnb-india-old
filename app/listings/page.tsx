"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getListings } from "@/actions/listing/listing.action";
import { TbSmartHomeOff } from "react-icons/tb";

import DynamicSearchBarMobile from "@/components/shared/searchbars/dynamicSeachBarMobile";
import VillaCard from "@/components/shared/villaCard";
import BottomNavBar from "@/components/shared/navbar/generalBottomNavBar";

// Define the shape of your listing data
interface Listing {
  listing_id: string;
  title: string;
  pricePerDay: number;
  totalPrice: number; // Add this property
  basePrice: number; // Add this property
  updatedPrice: number; // Add this property
  reviewsData: Array<{
    reviews_total_id: string;
    review_total: number;
    review_count: number;
    listing_id: string;
    pointer_table_name: string;
  }>;
  city: string;
  state: string;
  numberOfBedrooms: number;
  numberOfBeds: number;
  numberOfBathrooms: number;
  family_only: boolean;
  bnbVerified: boolean;
  category: string;
  coverImage: string;
}

const ListingPage = () => {
  const [isDataLoading, setisDataLoading] = useState<boolean>(true);
  const [data, setData] = useState<Listing[]>([]);
  const [renderedItems, setRenderedItems] = useState<number>(10); // Initial number of items to render
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [numberOfDays, setNumberOfDays] = useState<number>(10); 

  const searchParams = useSearchParams();
  const checkin = searchParams?.get("checkin") ?? null;
  const checkout = searchParams?.get("checkout") ?? null;
  const adults = searchParams?.get("adults") ?? null;
  const children = searchParams?.get("children") ?? null;
  const pets = searchParams?.get("pets") ?? null;
  const location = searchParams?.get("location") ?? null;
  const category = searchParams?.get("category") ?? null;
  const placeType = searchParams?.get("placeType") ?? null;
  const priceRange = searchParams?.get("priceRange") ?? null;
  const amenities = searchParams?.get("amenities") ?? null;
  const bedroomCount = searchParams?.get("bedrooms") ?? null;
  const bedcount = searchParams?.get("beds") ?? null;
  const bathroomcount = searchParams?.get("bathrooms") ?? null;
  const familyonly = searchParams?.get("family_only") ?? null;
  const bnbverified = searchParams?.get("bnbVerified") ?? null;
  const sort = searchParams?.get("sort") ?? null;

  const [filters, setFilters] = useState<any>({
    category: "",
    priceRange: [0, 100000],
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setisDataLoading(true);
      const defaultAdults = 1;
      const defaultChildren = 0;
      const defaultPets = 0;
      const defaultCheckin = new Date();
      const defaultCheckout = new Date();
      defaultCheckout.setDate(defaultCheckout.getDate() + 1);
      const defaultLocation = "Anywhere";
      const defaultCategory = "All";
      const defaultplaceType = "All";
      const defaultpriceRange = "All";
      const defaultamenities = "All";
      const defaultbedroomCount = "All";
      const defaultbedcount = "All";
      const defaultbathroomcount = "All";
      const defaultfamilyonly = "All";
      const defaultbnbverified = "All";
      const defaultsort = "desc";

      const actualAdults = adults !== null ? Number(adults) : defaultAdults;
      const actualChildren =
        children !== null ? Number(children) : defaultChildren;
      const actualPets = pets !== null ? Number(pets) : defaultPets;
      const actualCheckin =
        checkin !== null ? new Date(checkin) : defaultCheckin;
      const actualCheckout =
        checkout !== null ? new Date(checkout) : defaultCheckout;
      const actualLocation = location !== null ? location : defaultLocation;
      const actualCategory = category !== null ? category : defaultCategory;
      const actualplaceType = placeType !== null ? placeType : defaultplaceType;
      const actualpriceRange =
        priceRange !== null ? priceRange : defaultpriceRange;
      const actualamenities = amenities !== null ? amenities : defaultamenities;
      const actualbedroomCount =
        bedroomCount !== null ? bedroomCount : defaultbedroomCount;
      const actualbedcount = bedcount !== null ? bedcount : defaultbedcount;
      const actualbathroomcount =
        bathroomcount !== null ? bathroomcount : defaultbathroomcount;
      const actualfamilyonly =
        familyonly !== null ? familyonly : defaultfamilyonly;
      const actualbnbverified =
        bnbverified !== null ? bnbverified : defaultbnbverified;
      const actualsort = sort !== null ? sort : defaultsort;

      setNumberOfDays((actualCheckout.getTime() - actualCheckin.getTime()) / (1000 * 60 * 60 * 24))



      const listings: any = await getListings(
        actualAdults,
        actualChildren,
        actualPets,
        actualCheckin,
        actualCheckout,
        actualLocation,
        actualCategory,
        actualplaceType,
        actualpriceRange,
        actualamenities,
        actualbedroomCount,
        actualbedcount,
        actualbathroomcount,
        actualfamilyonly,
        actualbnbverified,
        actualsort,
      );
      setData(listings);
      console.log("Listing came from backend",listings);
      // const singleListing = listings[0];

      // Create an array with 50 copies of the single listing
      // const duplicatedListings = Array(50).fill(singleListing);
      // console.log(duplicatedListings);

      // setData(duplicatedListings);
      setisDataLoading(false);
    };

    fetchData();
  }, [searchParams]);

  const handleScroll = () => {
    if (
      typeof window !== "undefined"
        ? window.innerHeight
        : 0 + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 && !loadingMore
      // && renderedItems < data.length
    ) {
      setLoadingMore(true);
      setTimeout(() => {
        setRenderedItems((prev) => prev + 10); // Load 10 more items
        setLoadingMore(false);
      }, 500); // Simulate a loading delay
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loadingMore]);

  // const handleFilterChange = (e: any) => {
  //   const { name, value, type, checked }: any = e.target;
  //   setFilters((prevFilters: any) => ({
  //     ...prevFilters,
  //     [name]: type === 'checkbox' ? checked : value,
  //   }));
  // };

  const filteredData = data
    ? data.filter((d) => {
      var {
        priceRange,
        bedrooms,
        beds,
        bathrooms,
      } = filters;

      return (
        d.pricePerDay >= priceRange[0] &&
        (priceRange[1] == 100000 ? true : d.pricePerDay <= priceRange[1]) &&
        d.numberOfBedrooms >= bedrooms &&
        d.numberOfBeds >= beds &&
        d.numberOfBathrooms >= bathrooms
      );
    })
    : [];

  // console.log({ filteredData })

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full flex-grow">
        <div className="w-full h-[80vh] mt-[17vh] md:mt-[3vh]">
          {isDataLoading ? (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center text-center">
              <p>loading....</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="w-full h-[100vh] flex flex-col justify-center items-center text-center">
              <TbSmartHomeOff size={32} color="gray" />
              <p>sorry, we could not find any villas</p>
            </div>
          ) : (
            <div className="relative w-full md:space-x-2 lg:space-x-4  px-3 mx-auto grid justify-center grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 min-[1800px]:grid-cols-6">
              {filteredData.slice(0, renderedItems).map((d) => (
                <div className="my-3 sm:my-5" key={d.listing_id}>
                  <VillaCard
                    image={d.coverImage}
                    name={d.title}
                    totalPrice ={d.totalPrice}
                    basePrice={d.basePrice} 
                    UpdatedPrice={d.totalPrice/numberOfDays} 
                    city={d.city}
                    state={d.state}
                    rooms={d.numberOfBedrooms}
                    id={d.listing_id}
                    family_only={d.family_only}
                    bnbVerified={d.bnbVerified}
                    showTotal={true}
                    reviewsData={d.reviewsData}
                    className="rounded-3xl"
          
                  />
                </div>
              ))}
            </div>
          )}
          {loadingMore && renderedItems < data.length && (
            <div className="w-full text-center py-4">
              Loading more villas...
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function Listings() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
      <ListingPage />
    </Suspense>
    <BottomNavBar/>
    </>
  );
}
