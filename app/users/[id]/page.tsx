"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// import { getBlogBy_Particular_Host } from "@/actions/blog/blog.action";
import { getListingFor_Particular_Host } from "@/actions/listing/listing.action";
import { fetchUser } from "@/actions/users.actions";
// import { addDays } from "date-fns";
import toast from "react-hot-toast";
import HostListingCard from "@/components/shared/HostListingCard";


import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
// import ListingCard from "@/components/shared/HostListingCard";
import Navbar from "@/components/shared/navbar/generalNavbar";
// import { ReviewCarousel } from "@/components/shared/reviewCarousel";
// import ReviewCard from "@/components/shared/users/reviewCard";
import VillaCard from "@/components/shared/villaCard";
// import { Result } from "postcss";
import DynamicHead from "@/components/DynamicHead";

export default function Profile() {
  // const userID = params.id;
  const params = useParams();
  const userID = Array.isArray(params!.id) ? params!.id[0] : params!.id;

  const [user, setUser] = useState<any>({
    first_name: "",
    last_name: "",
    profile_image: "",
    email_id: "",
    profileImage: "",
  });

  const [error, setError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true); // Add loading state
  const [loading1, setLoading1] = useState(true); // Add loading state
  const [listing, setlisting] = useState([]);

  useEffect(() => {
    const gethostlistings = async () => {
      setLoading1(true);
      try {
        const result: any = await getListingFor_Particular_Host(userID);
        console.log(result);

        if (result?.success) {
          setlisting(result?.data);                    
        } else {
          setlisting([]); // Set an empty array if result.data is not valid
          toast.error("No listings found.");
        }
        setLoading1(false);
      } catch (err) {
        setLoading1(false);
        setlisting([]); // Fallback to empty array on error
        toast.error("Server error occurred");
        console.error(err);
      }
    };

    gethostlistings();
  }, [userID]);
  const [blogs, setBlogs] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       setIsLoading(true); // Start loading
  //       const result: any = await getBlogBy_Particular_Host(userID); // Assuming your endpoint is exposed as an API
  //       console.log(result);

  //       if (result.success) {
  //         setBlogs(result.data);
  //         toast.success("Blogs fetched successfully");
  //       } else {
  //         setBlogs([]);
  //         toast.error(result.message || "Failed to fetch blogs");
  //       }
  //     } catch (error) {
  //       setBlogs([]);
  //       toast.error("An error occurred while fetching blogs");
  //       console.error("Error fetching blogs:", error);
  //     } finally {
  //       setIsLoading(false); // Stop loading
  //     }
  //   };

  //   if (userID) fetchBlogs(); // Fetch blogs only if userId is provided
  // }, [userID]);
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true); // Start loading before making the request
        const result: any = await fetchUser(userID);

        if (result.success) {
          console.log(result.data);
          setUser(result.data);
        } else {
          toast.error("You are not allowed");
          setError("The user does not exist !!");
        }
      } catch (err) {
        toast.error("Server error occurred");
        setError("Server error. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false); // Stop loading in both success and error cases
      }
    };

    fetchDetails();
  }, [userID]); // Ensure userID is in dependency array

  // Show loading skeleton if data is still being fetched
  if (loading || loading1 ) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          {/* Profile Image Skeleton */}
          <div className="h-24 w-24 rounded-full bg-gray-300 animate-pulse mx-auto"></div>

          {/* Name Skeleton */}
          <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded mx-auto"></div>

          {/* More Details Skeleton */}
          <div className="h-4 w-5/6 bg-gray-300 animate-pulse rounded mx-auto"></div>
          <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded mx-auto"></div>
        </div>
      </div>
    );
  }


  // If an error exists, show it
  if (error) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <>
    <DynamicHead title={`User |  ${user.first_name} ${user.last_name}`} />
      <Navbar />
      <div className="max-w-7xl mt-[1vh] mx-auto py-10 px-4 overflow-x-hidden sm:px-6 lg:px-8">
        {loading ? (
          <div className="animate-pulse">
            {/* Skeleton Loader for Profile Header */}
            <div className="flex gap-5 justify-start items-center flex-row mb-4">
              <div className="w-[100px] h-[70px] md:w-32 md:h-32 bg-gray-200 rounded-full"></div>
              <div className="ml-0 md:ml-5 mt-4 md:mt-0 md:text-left">
                <div className="w-40 h-6 bg-gray-200 rounded mb-2"></div>
                <div className="w-64 h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
            <hr className="mb-4" />
            {/* Skeleton Loader for Settings */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-6">
              {[...Array(7)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center md:flex-col md:items-start md:justify-between md:h-44 md:shadow-[0_8px_30px_rgb(0,0,0,0.12)] duration-300 gap-4 p-3 md:p-6 md:rounded-lg bg-white md:hover:border hover:border-pink-600"
                >
                  <div className="h-full w-full md:w-12 md:h-12 bg-gray-200 rounded-md"></div>
                  <div className="flex-1 md:flex md:flex-col ml-4">
                    <div className="w-32 h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="w-40 h-5 bg-gray-200 rounded"></div>
                  </div>
                  <div className="md:hidden">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Skeleton Loader for Logout Button */}
            <div className="flex items-center justify-center w-full mt-5 h-[40px] rounded-lg bg-gray-200 text-white font-bold cursor-not-allowed">
              <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
              <div className="w-16 h-5 bg-gray-300 rounded"></div>
            </div>
          </div>
        ) : (
          <div
            style={{ overflow: "scroll", scrollbarWidth: "none" }}
            className="flex flex-col md:flex-row items-start justify-between no-scroolbar  min-h-[80vh]"
          >
            {/* Left Part */}
            <div className="w-full md:w-[40%] flex flex-col items-center justify-center sticky top-0 p-6">
              <div className="w-full md:w-[80%] mb-4 max-w-sm mx-auto px-3 py-10 flex flex-row items-center justify-center bg-white rounded-2xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                {/* Profile Image and Info */}
                <div className="flex flex-col w-[60%] items-center space-x-4">
                  <div className="relative">
                    <img
                      src={user.profile_image}
                      alt="House"
                      className="w-28 h-28 object-cover border-[2px] border-gray-400 p-1 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-xl text-left font-bold">
                      {user.first_name} {user.last_name}
                    </p>
                    {/* <p className="text-sm text-gray-500 flex items-center">
                      <FaCheckCircle className="text-pink-500 mr-1" />
                      Superhost
                    </p> */}
                    <div className=" flex  w-full flex-row  justify-start items-center">
                                    <p className="text-xs ">hosting since january 2025</p>
                                </div>
                  </div>
                </div>

                {/* Stats */}
                {/* <div className="flex flex-col items-center space-y-4">
                                <div className="flex border-b-2 pb-1 w-full flex-col justify-start items-start">
                                    <p className="text-xl text-left font-bold">74</p>
                                    <p className="text-sm text-gray-800">Reviews</p>
                                </div>
                                <div className="flex w-full border-b-2 pb-1 flex-col justify-start items-start">
                                    <p className="text-xl text-left font-bold">4.73</p>
                                    <div className="flex items-center justify-center space-x-1">
                                        <FaStar className="text-pink-500" />
                                        <p className="text-sm text-gray-500">Rating</p>
                                    </div>
                                </div>
                                <div className="flex w-full flex-col justify-start items-start">
                                    <p className="text-xl text-left font-bold">8</p>
                                    <p className="text-sm text-gray-500">Months hosting</p>
                                </div>
                            </div> */}
              </div>
              {/* 
                        <div className="w-full md:w-[80%] border-2 mt-3 rounded-[20px] max-w-sm mx-auto p-4 flex flex-row items-center justify-between bg-white">
                 
                            <div className="flex flex-col w-full p-3 items-center space-x-4">
                                <div>
                                    <p className="text-2xl text-left font-bold">{user.first_name} {user.last_name}'s confirmed information</p>
                                    <p className="text-xl m-1 text-gray-500 flex items-center">
                                        <IoIosCheckmark className="text-4xl" />
                                        Identity
                                    </p>
                                    <p className="text-xl m-1 text-gray-500 flex items-center">
                                        <IoIosCheckmark className="text-4xl" />
                                        Email address
                                    </p>
                                    <p className="text-xl m-1 text-gray-500 flex items-center">
                                        <IoIosCheckmark className="text-4xl" />
                                        Phone number
                                    </p>
                                </div>
                            </div>
                        </div> */}
                         
            </div>

            {/* Right Part */}
            <div
              style={{ overflow: "scroll", scrollbarWidth: "none" }}
              className="w-full  md:w-[60%] h-screen overflow-y-scroll p-6"
            >
              <div className="mt-8  pb-6 border-b-2">
                <p className="text-3xl mb-4 text-left font-bold">
                  About {user.first_name} {user.last_name}
                </p>
                <div
                  className="prose prose-lg prose-pink max-w-none mb-10 leading-relaxed text-gray-800"
                  dangerouslySetInnerHTML={{
                    __html: user?.description || <></>,
                  }}
                />
              </div>

              {/* <div className="mt-8 pb-6 border-b-2">
                            <p className="text-2xl mb-4 text-left font-bold">{user.first_name} {user.last_name}’s Reviews</p>
                            <p className="text-sm text-gray-500 mb-6">
                                Check out what our guests have to say about their experiences with {user.first_name} {user.last_name}. Our reviews highlight the exceptional service and unforgettable stays that our guests have enjoyed.
                            </p>

                            <Carousel className="w-[96%]">
                                <CarouselContent>
                                    {reviewsTotal.map((d, index) => (
                                        <CarouselItem key={index} className="lg:basis-1/2 max-w-[100%]">
                                            <div className="relative  rounded-lg h-full">
                                                <ReviewCard data={d} />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div> */}
              {/* <br /> */}
              <div className="mt-8">
                <p className="text-2xl mb-4 text-left font-bold">
                  {user.first_name} {user.last_name}’s Listings
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Explore {user.first_name} {user.last_name}’s exclusive villa
                  listings. As your host, we offer a diverse range of
                  accommodations, each designed to provide a unique and
                  memorable stay tailored to your preferences.
                </p>
                {listing.length > 0 ? (
                  <Carousel className="w-[96%]">
                    <CarouselContent>
                      {listing.map((d: any, index: any) => (
                        <CarouselItem
                          key={index}
                          className="lg:basis-1/2 max-w-[100%]"
                        >
                          <div className="relative rounded-lg p-2 h-full">
                          <VillaCard
                              image={d.coverImage}
                              name={d.title}
                              totalPrice ={Number(d.pricePerDay)}
                              basePrice={Number(d.pricePerDay)} 
                              UpdatedPrice={Number(d.pricePerDay)} 
                              showTotal={false}
                              city={d.city}
                              state={d.state}
                              rooms={Number(d.numberOfBedrooms)}
                              id={d.listing_id}
                              family_only={d.family_only}
                              bnbVerified={d.bnbVerified}
                              reviewsData={[]}
                              className="rounded-2xl"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <p>
                    {listing.length === 0
                      ? "No listings available."
                      : "Loading..."}
                  </p>
                )}
              </div>
              {/* <div className="mt-8">
                <p className="text-2xl mb-4 text-left font-bold">
                  {user.first_name} {user.last_name}’s Blogs
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Here are some of the most popular blogs written by{" "}
                  {user.first_name} {user.last_name}. Dive into our latest posts
                  and explore a range of topics that interest you, from
                  insightful guides to engaging stories and updates.
                </p>
                {blogs.length > 0 ? (
                  <Carousel className="w-[96%]">
                    <CarouselContent>
                      {blogs.map((blog, index) => (
                        <CarouselItem
                          key={index}
                          className="lg:basis-1/2 max-w-[100%]"
                        >
                          <div className="relative rounded-lg p-2 h-full">
                            <BlogCard
                              key={index}
                              image={blog.image}
                              title={blog.title}
                              date={blog.date}
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <div>No blogs found.</div> // Fixed malformed <div> here
                )}
              </div> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

const BlogCard = ({ image, title, date }: any) => {
  return (
    <div className="max-w-sm bg-white border p-1 rounded-2xl border-gray-200  overflow-hidden">
      <img
        src={image}
        alt={title}
        className="w-full rounded-2xl h-48 object-cover"
      />
      <div className="p-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <p className="text-gray-700 p-1 text-md ">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia
        odio vitae vestibulum.
      </p>
    </div>
  );
};
