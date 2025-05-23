'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { TbSmartHomeOff } from "react-icons/tb";
import { getExploreBlogs } from "@/actions/blog/blog.action";
import BlogCard from '@/components/blogs/blogCard';
import { useSearchParams } from 'next/navigation';
import DynamicHead from "@/components/DynamicHead";

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

  export default function ExploreBlogPage(){

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const search = searchParams?.get('search') ?? 'NA';


  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response: any = await getExploreBlogs(search);
        if (!response.success) {
          throw new Error('Failed to fetch blogs');
        }
        console.log(response);


        setBlogs(response.data);
        console.log(response.data);
        
        setLoading(false);
      } catch (error: any) {
        setError(error.message);
        setLoading(false);
      }

    };

    fetchBlogs();
  }, [searchParams]);
  
  return (
    <>
    <DynamicHead title={"Blogs - Explore"} />
      <div className="flex flex-col items-center justify-center w-full flex-grow">
        <div className="w-full h-[80vh] sm:mt-[15vh] md:mt-[3vh]">
          {
           blogs.length === 0 ?
                <div className="w-full h-[100vh] flex flex-col justify-center items-center text-center">
                  <TbSmartHomeOff size={32} color="gray" />
                  <p>sorry, we could not find any blogs</p>
                </div>
                :
                <div className="w-full mx-auto grid justify-center grid-cols-1  md:grid-cols-2 lg:grid-cols-4 min-[1600px]:grid-cols-5 min-[2560px]:grid-cols-6">
                  {blogs.map((data: BlogPost, index: any) => (
                        <BlogCard
                        key={data.id}
                        id={data.id}
                        image={data.imageUrl}
                        name={data.title}
                        discription={data.content}                       
                        />
                    ))}
                </div>
          }
        </div>
      </div>
    </>
  );
};
