import BlogCarousel from "@/components/blogs/carousel";
import BlogMultiCardCarousel from "@/components/blogs/recentBlogCarousel";
import OurStories from "./components/ourStories";
import { FaArrowRight } from "react-icons/fa6";
import Link from "next/link";


export default function BlogPage() {
  return (
    <>
      <main className="flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <section className="mb-6">
            <BlogCarousel />
          </section>

          <div className="px-3 sm:px-6 text-xl font-bold">
            <section>
              <h2 className="text-center md:text-start md:ml-10">Recent blog posts</h2>
              <BlogMultiCardCarousel />
            </section>

            <OurStories/>

            <section className="flex justify-center md:mt-10  mb-10">
                <Link href={"./blogs/explore"} className=" flex gap-3 items-center cursor-pointer group hover:drop-shadow-md" >
                <h2>Explore more Blogs</h2>
                <FaArrowRight className="group-hover:translate-x-1 transition-all duration-300"/>
                </Link>
                
            </section>

          </div>
        </div>
      </main>
    </>
  );
}


