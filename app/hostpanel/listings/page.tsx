"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import HostListingCard from "@/components/shared/HostListingCard";
import { getListingForOwner } from "@/actions/listing/listing.action";
import toast from "react-hot-toast";
import { FaHeartBroken } from "react-icons/fa";
import DynamicHead from "@/components/DynamicHead";

const SkeletonCard = () => (
  <div className="flex items-center p-4 border-b border-gray-200 animate-pulse">
    {/* Image Placeholder */}
    <div className="w-16 h-16 bg-gray-300 rounded-md mr-4"></div>

    {/* Content Placeholder */}
    <div className="flex-grow">
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
    </div>

    {/* Status Placeholder */}
    <div className="w-12 h-4 bg-gray-300 rounded"></div>
  </div>
);

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const result: any = await getListingForOwner();
        console.log(result.data);

        if (result.success) {
          setData(result?.data);
        } else {
          toast.error("You are not allowed");
        }
      } catch (err) {
        toast.error("Server error");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div className="container mx-auto md:mt-[10vh] p-4">
      <DynamicHead title={"HostPanel - Listings"} />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your listings</h1>
        <Link href="/hostpanel/listings/create">
          <div className="inline-block bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-300">
            Create Listing
          </div>
        </Link>
      </div>
      <div className=" gap-2 rounded-lg overflow-hidden ">
        {loading ? (
          <div className="flex flex-col gap-4">
            {/* Render 6 skeleton cards */}
            {[...Array(3)].map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : data.length > 0 ? (

          <div className="flex flex-col gap-2">
            {
              data.map((listing: any) => (
                <HostListingCard
                  key={listing.listing_id}
                  id={listing.listing_id}
                  listing={listing.title}
                  location={`${listing.area_name}, ${listing.state}`}
                  status={listing.isListed ? "Listed" : "Unlisted"}
                  image={listing.coverImage}
                />
              ))
            }
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <FaHeartBroken className="text-gray-500 text-6xl" />
            <p className="text-xl md:text-2xl font-semibold text-gray-700">No Listings Found</p>
            <p className="text-base text-gray-500">It looks like you don't have any listings yet.</p>
            <a
              href="/hostpanel/listings/create"
              className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600 transition duration-300"
            >
              Create a Listing
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
