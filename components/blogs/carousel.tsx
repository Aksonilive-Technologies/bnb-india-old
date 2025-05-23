"use client";

import React from "react";
import { useEffect, useState } from "react";

import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

import Image from "next/image";

import truncateText from "@/utils/CommonFunctions";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Define the type for the custom arrow component props
interface ArrowProps {
  onClick: () => void;
}

// Custom left arrow component
const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full"
    onClick={onClick}
  >
    <FaChevronLeft />
  </button>
);

// Custom right arrow component
const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-gray-800 text-white rounded-full"
    onClick={onClick}
  >
    <FaChevronRight />
  </button>
);

// Define the responsive settings with the correct type
const responsive: any = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function BlogCarousel() {

  const [maxLength, setMaxLength] = useState(500);

  useEffect(() => {
    if (typeof window !== 'undefined'){

      const updateMaxLength = () => {
        setMaxLength(window.innerWidth < 800 ? 120 : 500);
      };
      
      updateMaxLength();
      window.addEventListener('resize', updateMaxLength);
      
      return () => window.removeEventListener('resize', updateMaxLength);
    }
  }, []);



  return (
    <div className="sm:p-4">
      <div className="relative overflow-hidden rounded-none sm:rounded-2xl">
        <Carousel
          swipeable={true}
          draggable={false}
          showDots={true}
          responsive={responsive}
          ssr={true} // means to render carousel on server-side.
          infinite={true}
          autoPlaySpeed={10000}
          keyBoardControl={true}
          customTransition="all .5s"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["mobile"]}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          customLeftArrow={<CustomLeftArrow onClick={() => { }} />}
          customRightArrow={<CustomRightArrow onClick={() => { }} />}
        >
          {carouselData.map((data, index) => (
            <div key={index} className="relative  bg-gray-400  h-[70vh] ">
              <Image
                src={data.image}
                alt={`featured blog thumbnail - ${data.blogId}`}
                width={1000}
                height={550}
                className="object-cover w-full h-full"
              />
              <div className="w-full h-full black-gradient absolute inset-0 opacity-80"></div>
              <div className="w-full h-full absolute inset-0 px-4 md:px-20 flex flex-col justify-end gap-2 pb-12 md:pb-14 group cursor-pointer hover:drop-shadow-lg text-white">
                <h1 className="font-semibold text-sm">FEATURED</h1>
                <div className="flex items-center gap-6  cursor-pointer hover:drop-shadow-2xl">
                  <h1 className="text-2xl md:text-5xl font-extrabold md:max-w-[70%]">
                    {data.title}
                  </h1>
                  <FaChevronRight
                    size={30}
                    className="hidden md:inline-block group-hover:translate-x-4 transition-all duration-500"
                  />
                </div>
                <h2 className="md:text-lg py-2">
                  {truncateText(data.discription, maxLength)}
                </h2>

              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

const carouselData = [
  {
    image: "/h2.jpg",
    title: "How to List your Villa on BnbIndia?",
    discription:
      "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “",
    blogId: "01",
  },
  {
    image: "/h3.jpg",
    title: "How to List your Villa on BnbIndia?",
    discription:
      "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care",
    blogId: "02",
  },
  {
    image: "/h4.jpg",
    title: "How to List your Villa on BnbIndia?",
    discription:
      "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care",
    blogId: "03",
  },
  {
    image: "/h5.jpg",
    title: "How to List your Villa on BnbIndia?",
    discription:
      "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care",
    blogId: "04",
  },
];
