"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import truncateText from "@/utils/CommonFunctions";
import { LuMapPin } from "react-icons/lu";

import "@/styles/funkySlider.css";
import Link from "next/link";
import { fetchLuxuryVillas } from '@/actions/listing/listing.action';
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";


interface LuxuryVilla {
  id: number;
  des: string;
  city: string;
  state: string;
  title: string;
  rooms: number;
  price: number;
  imageurl: string;
  numberOfBeds: number;
  maxGuests: number;
  numberOfBathrooms: number;
}

const FunkeySlider = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const runningTimeRef = useRef<HTMLDivElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);

  const [fetching, setFetching] = useState<boolean>(true);
  const [data, setData] = useState<LuxuryVilla[]>([]);

  const timeRunning = 3000;
  const timeAutoNext = 8000;
  let runTimeOut: NodeJS.Timeout;
  let runNextAuto: NodeJS.Timeout;

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: any = await fetchLuxuryVillas();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, []);

  // Handle auto-slide
  useEffect(() => {
    if (data.length === 0) return;

    resetTimeAnimation();
    runNextAuto = setTimeout(() => {
      nextBtnRef.current?.click();
    }, timeAutoNext);

    return () => {
      clearTimeout(runNextAuto);
      clearTimeout(runTimeOut);
    };
  }, [data]);

  const resetTimeAnimation = () => {
    if (runningTimeRef.current) {
      runningTimeRef.current.style.animation = "none";
      runningTimeRef.current.offsetHeight; // Trigger reflow
      runningTimeRef.current.style.animation = "runningTime 7s linear 1 forwards";
    }
  };

  const showSlider = (type: "next" | "prev") => {
    if (!listRef.current || !carouselRef.current) return;

    const sliderItemsDom = Array.from(listRef.current.querySelectorAll<HTMLDivElement>(".item"));

    if (sliderItemsDom.length === 0) return;

    if (type === "next") {
      listRef.current.appendChild(sliderItemsDom[0]);
      carouselRef.current.classList.add("next");
    } else {
      listRef.current.prepend(sliderItemsDom[sliderItemsDom.length - 1]);
      carouselRef.current.classList.add("prev");
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
      carouselRef.current?.classList.remove("next");
      carouselRef.current?.classList.remove("prev");
    }, timeRunning);

    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
      nextBtnRef.current?.click();
    }, timeAutoNext);

    resetTimeAnimation();
  };

  return (
    <>
      {fetching ? (
        <div className="carousel">
          <div className="w-full p-4 space-y-4">

            <div className="w-full h-[80vh] bg-gray-300 animate-pulse rounded-lg"></div>
          </div>
        </div>
      ) : (
        <div className="carousel" ref={carouselRef}>
          <div className="list" ref={listRef}>
            {data.length > 0 &&
              data.map((villa) => (
                <div key={villa.id} className="item relative overflow-hidden">
                  <Image
                    src={villa.imageurl || "/placeholder.jpg"}
                    alt={villa.des || "Luxury Villa"}
                    width={1400}
                    height={1000}
                    objectFit="cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="content">
                    <div className="title">{villa.title}</div>
                    <div className="flex pl-2 gap-1 items-center">
                      <LuMapPin />
                      <p className="state" >
                        {villa.city}, {villa.state}
                      </p>
                    </div>
                    <div className="des">
                      {villa.des.length > 200 ? villa.des.substring(0, 200) + "..." : villa.des}
                    </div>
                    <Link
                      href={`/details/${villa.id}`}
                      className="btn border-2 flex justify-center items-center w-32 p-2 py-1 rounded-md font-semibold hover:bg-green-500"
                    >
                      <p>View Details</p>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
          <div className="arrows">
            <button className="prev  flex items-center justify-center" ref={prevBtnRef} onClick={() => showSlider("prev")}>
              <AiOutlineLeft size={24} className="text-gray-700 font-900" />
            </button>
            <button className="next flex items-center justify-center" ref={nextBtnRef} onClick={() => showSlider("next")}>
              <AiOutlineRight size={24} className="text-gray-700 font-900" />
            </button>
          </div>
          <div className="timeRunning" ref={runningTimeRef}></div>
        </div>
      )}
    </>
  );
};

export default FunkeySlider;
