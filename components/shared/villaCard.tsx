"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  addWishlistForUser,
  deleteWishlistForUser,
} from "@/actions/listing/listing.action";
import { auth } from "@/firebase/firebaseConfig";
import truncateText from "@/utils/CommonFunctions";
import { useMediaQuery } from "@mui/material";
import { addDays } from "date-fns";
import { onAuthStateChanged, User } from "firebase/auth";
import { BedDouble, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { BsFillHeartFill, BsHeart } from "react-icons/bs";
import { IoStarSharp } from "react-icons/io5";
import { MdOutlineImageNotSupported } from "react-icons/md";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { formatNumberWithCommas } from "@/app/details/[id]/paymentUtils/utils";

interface ListingReviewData {
  reviews_total_id: String;
  review_total: Float32Array;
  review_count: Number;
  listing_id: String;
  pointer_table_name: String;
}

interface VillaCardProps {
  image: string;
  name: string;
  basePrice: number;
  UpdatedPrice: number;
  totalPrice: number;
  city: string;
  state: string;
  rooms: number;
  id: string;
  family_only: boolean;
  bnbVerified: boolean;
  showTotal: boolean;
  reviewsData: Array<{
    reviews_total_id: string;
    review_total: number;
    review_count: number;
    listing_id: string;
    pointer_table_name: string;
  }>;
  className?: string;
}

export default function VillaCard({
  image,
  name,
  basePrice,
  UpdatedPrice,
  totalPrice,
  city,
  state,
  rooms,
  id,
  family_only,
  bnbVerified,
  showTotal,
  reviewsData,
  className = "rounded-3xl",
}: VillaCardProps) {
  const searchParams = useSearchParams();
  const checkin =
    searchParams?.get("checkin") || new Date().toISOString().split("T")[0];
  const checkout =
    searchParams?.get("checkout") ||
    addDays(new Date(), 1).toISOString().split("T")[0];
  const adults = searchParams?.get("adults") || "1";
  const children = searchParams?.get("children") || "0";
  const pets = searchParams?.get("pets") || "0";

  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnimate(true);
    e.stopPropagation(); // Prevents bubbling up to Link
    e.preventDefault(); // Stops Link navigation

    if (!user) return toast.error("You are not logged in. Please login...");

    setSaved((prev) => !prev);
    saved
      ? await deleteWishlistForUser(id, user.uid)
      : await addWishlistForUser(id, user.uid);

    toast.success(saved ? "Removed from wishlist" : "Added to wishlist");

    setTimeout(() => setAnimate(false), 250);
  };

  return (
    <div className={`relative h-[420px] mx-1 ${className} p-1`}>
      <Link
        href={`/details/${id}?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}&pets=${pets}`}
        target={isMobileOrTablet ? "_self" : "_blank"}
        onClickCapture={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest(".save-button")) {
            e.preventDefault(); // Prevents Link click when clicking the save button
          }
        }}
      >
        <div
          className={`h-[75%] ${className} bg-gray-100 overflow-hidden relative`}
        >
          {image ? (
            <Image
              src={image}
              alt="Villa Image"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex w-full h-full justify-center items-center text-gray-500">
              <MdOutlineImageNotSupported size={50} />
            </div>
          )}

          <div className="absolute top-3 left-3 flex gap-2 z-1">
            {bnbVerified && (
              <RiVerifiedBadgeFill
                className="text-blue-500 bg-white rounded-full"
                size={24}
                title="BnBIndia Verified"
              />
            )}
            {family_only && (
              <div className="w-28 flex items-center justify-center bg-white shadow-md rounded-full px-2 font-semibold">
                Family only
              </div>
            )}
          </div>

          {/* Save Button - Prevents Link Click */}
          <button onClick={handleSave} className="absolute top-3 right-3">
            {saved ? (
              <BsFillHeartFill
                size={24}
                color="red"
                className={` duration-500 ${animate ? "scale-125" : ""}`}
              />
            ) : (
              <BsHeart
                size={24}
                style={{ stroke: "white", strokeWidth: 0.6 }}
                color="white"
                className={`duration-500 overflow-auto ${animate ? "scale-125" : ""}`}
              />
            )}
          </button>
        </div>

        <div className="w-full flex justify-between items-center">
          <h1 className="text-[1.17rem] p-1 font-bold truncate">
            {truncateText(name, 30)}
          </h1>
          <div>
            {reviewsData.length > 0 ? (
              <div className="flex items-center">
                <IoStarSharp />
                <p>
                  {reviewsData[0].review_total}({reviewsData[0].review_count})
                </p>
              </div>
            ) : null
            // <p className="font-medium tracking-tighter">New</p>
            }
          </div>
        </div>

        <div className="text-[1rem] pl-2 font-semibold text-gray-600">
          <div className="flex flex-wrap space-x-3">
            <p className="flex gap-1 items-center">
              {truncateText(`${city}, ${state}`, 40)}
            </p>
            <p className="flex gap-1 items-center">
              <BedDouble className="size-4" /> {rooms} bedroom
            </p>
          </div>

          <div className="text-[1.15rem] flex flex-wrap justify-start">
            {UpdatedPrice < basePrice ? (
              <div className="flex font-bold space-x-2">
                <p className="line-through text-gray-500 flex items-center">
                  ₹{formatNumberWithCommas(basePrice)}
                </p>
                <p className="flex items-center text-black">₹{formatNumberWithCommas(Math.ceil(UpdatedPrice))
                }</p>
              </div>
            ) : (
              <p className="flex items-center text-black font-semibold">
                ₹{formatNumberWithCommas(Math.ceil(UpdatedPrice))}
              </p>
            )}
            <p className="font-normal text-black">&nbsp;night</p>
            {showTotal && (
              <>
                  <p className="px-2">.</p>
                  <p className="flex items-center font-normal underline">
                    ₹{formatNumberWithCommas(totalPrice)} total
                  </p>
              </>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
