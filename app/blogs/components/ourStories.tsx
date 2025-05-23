import Image from "next/image";
import truncateText from "@/utils/CommonFunctions";
import { FaArrowRight } from "react-icons/fa6";

export default function OurStories(){
    return(
        <section className="mt-6 h-full">
              <h2 className="text-center h-full md:ml-10 md:text-start">Our Stories</h2>
              <div className="grid grid-rows-2 md:grid-rows-1  md:grid-cols-2 md:px-10 sm:m-3  gap-2 md:gap-4 py-4">
                <div className="w-full h-80 md:h-[80vh] bg-blue-400 rounded-xl overflow-hidden relative cursor-pointer group hover:rounded-none hover:drop-shadow-xl transition-all duration-500">
                  <Image
                    src={"/h2.jpg"}
                    alt={`titl1-1`}
                    width={1000}
                    height={550}
                    className="object-cover w-full h-full"
                  />
                  <div className="w-full h-full black-gradient absolute inset-0 opacity-40"></div>
                  <header className="sm:w-[83%] h-full absolute inset-0 px-4 text-white drop-shadow-2xl flex flex-col justify-end ">
                      <h1 className="text-xl md:text-3xl font-extrabold">
                        {ourStoriesData[0].title}
                      </h1>
                      <h2 className="text-sm sm:text-lg font-medium py-2">
                        {truncateText(ourStoriesData[0].discription, 120)}
                      </h2>
                    </header>

                    <figure className="absolute hidden md:inline-block right-12 bottom-5 group-hover:translate-x-3 transition-all duration-500"><FaArrowRight color="white" size={26} /></figure>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-1  md:grid-rows-2 md:pr-12  h-60 md:h-[80vh] gap-2 md:gap-4">
                  <figure className="h-full w-full bg-green-500 rounded-xl overflow-hidden relative cursor-pointer group hover:rounded-none hover:drop-shadow-xl transition-all duration-500">
                    <Image
                      src={"/h3.jpg"}
                      alt={`title-2`}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                    <div className="w-full h-full black-gradient absolute inset-0 opacity-40"></div>
                    <header className="md:w-[83%] h-full absolute inset-0 px-4 text-white drop-shadow-2xl flex flex-col justify-end">
                      <h1 className="text-xl md:text-3xl font-extrabold">
                        {ourStoriesData[1].title}
                      </h1>
                      <h2 className="text-xs md:text-lg font-medium py-2">
                        {truncateText(ourStoriesData[1].discription, 100)}
                      </h2>
                    </header>

                    <figure className="hidden md:inline-block absolute right-12 bottom-5 group-hover:translate-x-3 transition-all duration-500"><FaArrowRight color="white" size={26} /></figure>
                  </figure>
                  <figure className="h-full w-full bg-green-500 rounded-xl overflow-hidden relative cursor-pointer group hover:rounded-none hover:drop-shadow-xl transition-all duration-500">
                    <Image
                      src={"/h4.jpg"}
                      alt={`title-3`}
                      width={500}
                      height={500}
                      className="object-cover w-full h-full"
                    />
                    <div className="w-full h-full black-gradient absolute inset-0 opacity-40"></div>
                    <header className="md:w-[83%] h-full absolute inset-0 px-4 text-white drop-shadow-2xl flex flex-col justify-end">
                      <h1 className="text-xl md:text-3xl font-extrabold">
                        {ourStoriesData[2].title}
                      </h1>
                      <h2 className="text-xs md:text-lg font-medium py-2">
                        {truncateText(ourStoriesData[2].discription, 100)}
                      </h2>
                    </header>

                    <figure className="hidden md:inline-block absolute right-12 bottom-5 group-hover:translate-x-3 transition-all duration-500"><FaArrowRight color="white" size={26} /></figure>
                  </figure>
                </div>
              </div>
            </section>
    )
}


const ourStoriesData = [
    {
      image: "/h2.jpg",
      title: "Bnb India Journey so far...",
      discription:
        "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “",
      blogId: "01",
    },
    {
      image: "/h3.jpg",
      title: "people of bnbIndia",
      discription:
        "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care",
      blogId: "02",
    },
    {
      image: "/h4.jpg",
      title: "our Shoutouts of 2024",
      discription:
        "A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care, A concept topic is more objective, containing definitions, rules, and guidelines. So a short description for a concept topic should answer the questions “What is the concept and why should users care",
      blogId: "03",
    },
  ];