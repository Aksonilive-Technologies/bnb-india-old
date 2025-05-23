"use client";

import { useEffect, useState } from "react";

import { fetchWishlistForUser } from "@/actions/listing/listing.action";
import { FaHeartBroken } from "react-icons/fa";
import { SlArrowRight } from "react-icons/sl";

import VillaCard from "@/components/shared/villaCard";
import DynamicHead from "@/components/DynamicHead";

// interface VillaCardProps {
//   image: string;
//   name: string;
//   price: number;
//   city: string;
//   state: string;
//   rooms: number;
//   id: string;
//   family_only: boolean;
//   bnbVerified: boolean;
//   className?: string; // Allow passing custom Tailwind CSS classes
// }

export default function SavedVilla() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    setLoading(true);
    try {
      const wishlistData = await fetchWishlistForUser();
      console.log("Fetched wishlist data:", wishlistData);

      // Ensure the userWishlist is an array before setting it in state
      if (wishlistData.success && Array.isArray(wishlistData.userWishlist)) {
        setData(wishlistData.userWishlist);
        console.log("the data is ", data);
      } else {
        setError("No wishlist data found.");
      }
    } catch (error) {
      console.error("Error fetching wishlist data", error);
      setError("An error occurred while fetching the wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const SkeletonLoader = () => (
    <div className="w-full mx-auto  mt-3 p-3 rounded-lg grid grid-cols-1 gap-6 display-no-scroll overflow-y-auto">
      <div className="mt-4 w-full sm:w-[96%]">
        <div className="grid grid-cols-1 mx-3 my-5 md:grid-cols-1 lg:grid-cols-3 min-[1440px]:grid-cols-3 min-[2560px]:grid-cols-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="mx-4 my-5 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-6 w-3/4 mb-2"></div>
                <div className="bg-gray-300 h-4 w-1/2"></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl min-h-[90vh] mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <DynamicHead title={"Wish List"} />
      <div className="text-gray-500 flex items-center justify-start gap-2">
        <a
          href="/profile"
          className="hover:text-pink-600 text-lg font-semibold transition-colors"
        >
          Account
        </a>
        <span>
          <SlArrowRight size={14} className="text-gray-400" />
        </span>
        <a
          href="#"
          className="hover:text-blue text-lg-500 font-semibold transition-colors"
        >
          Saved Villas
        </a>
      </div>
      <h1 className="md:text-4xl text-2xl mt-3 font-bold">Saved Villas</h1>
      <p className="hidden font-semibold text-gray-500 md:block mb-2 mt-2">
        Save and organize your favorite villas to easily access and revisit them
        later.
      </p>
      {loading ? (
        <SkeletonLoader />
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : data ? (
        <div className="w-full h-full ">
          <div className="mt-4 w-full sm:w-[96%]">
            <div className="grid grid-cols-1 mx-3 my-5 md:grid-cols-1 lg:grid-cols-3 min-[1440px]:grid-cols-3 min-[2560px]:grid-cols-4">
              {data?.map((d: any) => (
                <div key={d.id} className="mx-4 my-5">
                  <VillaCard
                    image={d.coverImage} // Use a fallback image if coverImage is empty
                    name={d.title}
                    totalPrice ={d.pricePerDay}
                    basePrice={d.pricePerDay} 
                    UpdatedPrice={d.pricePerDay} 
                    city={d.city}
                    state={d.state}
                    rooms={d.numberOfBedrooms}
                    id={d.listing_id}
                    family_only={d.family_only}
                    bnbVerified={d.bnbVerified}
                    showTotal={false}
                    reviewsData={[]}
                    className="rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
          <FaHeartBroken className="text-gray-500 text-6xl" />
          <p className="text-xl md:text-2xl font-semibold text-gray-700">
            No Wishlist Found
          </p>
          <p className="text-base text-gray-500">
            It looks like you haven't saved any villas yet.
          </p>
          <a
            href="/"
            className="mt-4 px-6 py-2 red-gradient text-white rounded-lg shadow-lg  transition duration-300"
          >
            Explore Villas
          </a>
        </div>
      )}
    </div>
  );
}

// const data = [
//   {
//     id: "1",
//     name: "Luxury pool villa",
//     image:
//       "https://assets.architecturaldigest.in/photos/62f4d46616c88215b7e80d3b/16:9/w_1615,h_908,c_limit/Step%20into%205%20of%20the%20most%20beautiful%20villas%20in%20Bengaluru.jpg",
//     price: "25000",
//     city: "Varca",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: true
//   },
//   {
//     id: "2",
//     name: "villa Pinewoods",
//     image:
//       "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Vagator",
//     state: "Goa",
//     rooms: "3",
//     family_only: false,
//     bnbVerified: true
//   },
//   {
//     id: "3",
//     name: "CodeMonkey villa",
//     image:
//       "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: false,
//     bnbVerified: false
//   },
//   {
//     id: "4",
//     name: "Tanmay's villa",
//     image:
//       "https://images.unsplash.com/photo-1595243643203-06ba168495ea?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Margao",
//     state: "Goa",
//     rooms: "3",
//     family_only: false,
//     bnbVerified: false
//   },
//   {
//     id: "5",
//     name: "Harsh's villa",
//     image:
//       "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Panjim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: true
//   },
//   {
//     id: "6",
//     name: "Javed's villa",
//     image:
//       "https://plus.unsplash.com/premium_photo-1675745329378-5573c360f69f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: false
//   },
//   {
//     id: "7",
//     name: "Luxury pool villa",
//     image:
//       "https://images.unsplash.com/photo-1607567618395-62fc2d132c3e?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: true
//   },
//   {
//     id: "8",
//     name: "Luxury pool villa",
//     image:
//       "https://images.unsplash.com/photo-1607567618395-62fc2d132c3e?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: false
//   },
//   {
//     id: "9",
//     name: "Luxury pool villa",
//     image:
//       "https://images.unsplash.com/photo-1607567618395-62fc2d132c3e?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: false
//   },
//   {
//     id: "10",
//     name: "Luxury pool villa",
//     image:
//       "https://images.unsplash.com/photo-1607567618395-62fc2d132c3e?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//     price: "25000",
//     city: "Curtorim",
//     state: "Goa",
//     rooms: "3",
//     family_only: true,
//     bnbVerified: false
//   },
// ];
