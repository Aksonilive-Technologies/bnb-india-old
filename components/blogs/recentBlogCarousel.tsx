"use client";

import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getExploreBlogs } from "@/actions/blog/blog.action";
import BlogCard from '@/components/blogs/blogCard';

// Define the type for the custom arrow component props
interface ArrowProps {
  onClick: () => void;
}

// Custom left arrow component
const CustomLeftArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute left-1 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#a3a3a375] sm:bg-gray-400 text-white rounded-full"
    onClick={onClick}
  >
    <FaChevronLeft />
  </button>
);

// Custom right arrow component
const CustomRightArrow: React.FC<ArrowProps> = ({ onClick }) => (
  <button
    className="absolute right-1 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-[#a3a3a375] sm:bg-gray-400 text-white rounded-full"
    onClick={onClick}
  >
    <FaChevronRight />
  </button>
);

// Define the responsive settings with the correct type
const responsive: any = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
  authorProfileImage?: string;
}

export default function BlogMultiCardCarousel() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response: any = await getExploreBlogs('NA');
        if (!response.success) {
          throw new Error('Failed to fetch blogs');
        }
        console.log(response);


        setBlogs(response.data);
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }

    };

    fetchBlogs();
  }, []);


  // if (loading) {
  //   return <SkeletonLoader />;
  // }
  return (
    <div className="py-4 w-full sm:p-4">
      {
        loading ?
          <div className=" flex flex-row justify-around gap-2 w-full">
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />


          </div> :

          <div className="relative">
            <Carousel
              swipeable={true}
              draggable={false}
              responsive={responsive}
              ssr={true} // means to render carousel on server-side.
              infinite={true}
              autoPlaySpeed={10000}
              keyBoardControl={true}
              customTransition="all .5s"
              transitionDuration={500}
              containerClass="carousel-container"
              // removeArrowOnDeviceType={["tablet", "mobile"]}
              dotListClass="custom-dot-list-style"
              itemClass="carousel-item-padding-40-px"
              customLeftArrow={<CustomLeftArrow onClick={() => { }} />}
              customRightArrow={<CustomRightArrow onClick={() => { }} />}
            >
              {blogs.map((data: BlogPost, index: any) => (
                <BlogCard
                key={data.id}
                id={data.id}
                image={data.imageUrl}
                name={data.title}
                discription={data.content}                       
                />
              ))}
            </Carousel>
          </div>
      }

    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4 w-[24%] p-2">
      {/* Skeleton Card */}
      <div className="bg-gray-200 animate-pulse rounded-lg overflow-hidden">
        <div className="h-48 bg-gray-300 rounded-t-lg"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      {/* Repeat for multiple cards if needed */}
    </div>
  );
}
