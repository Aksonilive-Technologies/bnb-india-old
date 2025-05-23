import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

import {
  BookOpenText,
  Headset,
  School,
  SearchCheck
} from "lucide-react";

import WhatWeDoSection from "@/components/homepage/whatWeDoSection";
import { ReviewCarousel } from "@/components/shared/reviewCarousel";
import SearchBar from "@/components/shared/searchbars/HomepagesearchCard";
import { TrendingCarousel } from "@/components/shared/TrendingCarousel";
import MobileSearchComponent from "@/components/shared/searchbars/MobileSearchComponent";

// Dynamically import the client component
const FunckySlider = dynamic(
  () => import("@/components/clientCallers/funckeySliderCaller"),
);

export default function HomePage() {
  return (
    <div className="bg-white w-[100vw]  flex flex-col items-center">
      <div className="h-[100vh]  w-full flex flex-col relative overflow-hidden ">
        <div className="flex-grow relative">
          {/* <!-- Video element for background --> */}
          <video
            autoPlay
            muted
            loop
            className="absolute inset-0 w-full h-[70vh] sm:h-[100vh] object-cover"
          >
            <source src="/bg_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* <!-- Gradient overlay --> */}
          <div className="absolute inset-0 brown-gradient h-[70vh] sm:h-[100vh]"></div>
        </div>
        <div className=" z-10 relative -top-24 sm:-top-0 ">
          <div className=" w-full h-[60vh] sm:h-[100vh] flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-5xl font-extrabold text-white text-center">
              Experience India’s Finest Luxury Stays
            </h1>
            <h2 className="p-4 text-lg sm:text-[1.4rem] font-medium text-white text-center w-[98%] lg:w-[80%]">
              Discover top-notch villas and apartments designed to elevate your
              vacation.
            </h2>

            <div className="w-full pt-8 hidden md:flex ">
              <SearchBar />
            </div>
            <div className="w-full md:hidden">
              <MobileSearchComponent/>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full sm:block max-w-[1800px]">
        {/* Trending section */}
        <div className="pt-0 lg:pt-16 sm:pt-8 p-4  flex flex-col justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex justify-center sm:self-start sm:pl-14 ">
            Explore Our Exclusive Collection
          </h1>

          <div className="w-full sm:w-[96%] mt-4 flex justify-center ">
            <TrendingCarousel />
          </div>
        </div>


        {/* Luxury stays section */}
        <div className="w-full  p-4  flex flex-col justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-bold flex justify-center sm:self-start sm:pl-14 p-4">
            Luxury stays
          </h1>
          <FunckySlider />
        </div>

        {/* explore what sets us apart section  */}
        <div>
          <div className="flex justify-center p-8 pt-20">
            <h2 className="text-2xl font-bold text-center">
              Book Your Dream Stay With Confidence
            </h2>
          </div>

          <div className="w-full flex justify-center">
            <div className="w-[90%] md:w-[85%] grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 relative">
              {hoverCardData.map((data, index) => (
                <Link
                href={{
                  pathname: "/listings",
                  query: {
                    category: data.id
                  },
                }}
                  className="w-full h-64 sm:h-80 lg:h-96 rounded-3xl relative overflow-hidden group cursor-pointer"
                  key={index}
                >
                  <Image
                    src={data.imageURL}
                    alt="location image"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-500 ease-in-out absolute"
                  />
                  <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-70 transition duration-500 ease-in-out"></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-4 mt-20">
                    <p
                      className="text-xl font-semibold sm:text-2xl text-yellow-50 group-hover:opacity-80"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {data.title}
                    </p>
                    <p
                      className="text-center text-sm sm:text-base text-gray-200 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {data.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div>
        <div className="flex justify-center">
          <div className="lg:w-[90%] py-8">
            <WhatWeDoSection />
          </div>
        </div>

        {/* 
        <div className="pt-16 sm:pt-8 p-4  flex flex-col justify-center items-center">
          <h1 className="text-2xl md:text-3xl font-semibold flex justify-center sm:self-start sm:pl-14 ">
            Find your perfect stays
          </h1>

          <div className="w-full sm:w-[96%]">
            <Categories />
          </div>
        </div> */}


        <div className="w-full flex justify-center mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 w-[90%] 2xl:w-[80%] gap-6 2xl:gap-12">
            {homepageTabs.map((data, index) => (
              <Link
                href={data.link}
                type="button"
                className=" border-[3px] w-full rounded-xl flex items-center px-10 py-2 gap-8 hover:bg-blue-50 duration-200"
                key={index}
              >
                <data.icon className="size-14 stroke-1" />
                <div>
                  <p className="text-xl font-semibold text-start">
                    {data.title}
                  </p>
                  <p className="text-start">{data.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* homepage review section  */}

        <div className="w-full flex flex-col items-center justify-center p-6 mt-12 ">
          <h2 className="text-2xl">
            {" "}
            BNBINDIA - WHERE HOSPITALITY MEETS TRUST
          </h2>
          <div className="w-full sm:w-[96%]  p-2 mt-4 flex justify-center ">
            <ReviewCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}

const hoverCardData = [
  {
    id: "SCENIC_RETREAT",
    title: "Amazing Locations",
    imageURL:
      "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    description:
      "Discover breathtaking locations with stunning views and top-notch amenities.",
  },
  {
    id: "NATURE_ESCAPE",
    title: "Nature Escapes",
    imageURL:
      "https://images.unsplash.com/photo-1735527919007-3ba8d909049e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Immerse yourself in nature with our serene and peaceful stays.",
  },
  {
    id: "LUXURY",
    title: "Great Experience",
    imageURL:
      "https://cdn.pixabay.com/photo/2023/04/24/03/16/camping-7947056_960_720.jpg",
    description: "Enjoy a great experience with our well-curated properties.",
  },
  {
    id: "FAMILY_FRIENDLY",
    title: "Family Friendly",
    imageURL:
      "https://images.unsplash.com/photo-1543095834-7445b8af8c2b?q=80&w=2015&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Create unforgettable family memories in our thoughtfully designed stays.",
  },
];

const homepageTabs = [
  {
    icon: School,
    title: "List Your Villa on BnBIndia",
    subtitle: "Become a Host",
    description: "Join our community and start hosting.",
    link: "/hostpanel/listings/create",
  },
  {
    icon: SearchCheck,
    title: "Explore tailored villas for getaways.",
    subtitle: "Choose Your Next Stay",
    description: "Find the perfect villa for your next vacation.",
    link: "/listings",
  },
  {
    icon: Headset,
    title: "Always Here: 24/7 Assistance",
    subtitle: "Round-the-Clock Support",
    description: "We're here to help anytime, anywhere.",
    link: "/helpandsupport",
  },
  {
    icon: BookOpenText,
    title: "Discover Our Villa Chronicles",
    subtitle: "BnBIndia Stories",
    description: "Read inspiring stories from our community.",
    link: "/blogs",
  },
];

// const dreamStaysSection = [
//   {
//     icon: UserPlus,
//     title: "150k+ Guests Hosted",
//   },
//   {
//     icon: HandPlatter,
//     title: "Impeccable Service",
//   },
//   {
//     icon: AlarmClock,
//     title: "24*7 Housekeeping",
//   },
//   {
//     icon: TentTree,
//     title: "Top-Tier Locations",
//   },
//   {
//     icon: Gem,
//     title: "Affordable Luxury",
//   },
//   {
//     icon: TicketCheck,
//     title: "Flexible Booking",
//   },
// ];
