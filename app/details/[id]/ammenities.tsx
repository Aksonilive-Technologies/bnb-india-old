"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getAllAmmenities } from "@/actions/listing/listing.action";

export default function ListingAmenities() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [listedAmenities, setListedAmenities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Loader state

  // Fetch amenities using useEffect
  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      const data = await getAllAmmenities();
      setListedAmenities(data);
      setShowButton(data.length > 14);
      setLoading(false);
    };

    fetchAmenities();
  }, []);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    };
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  return (
    <div className="my-4">
      <h2 className="text-lg font-semibold">Amenities</h2>

      {/* Loader */}
      {loading ? (
        <div className="py-2 flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="w-24 h-8 bg-gray-300 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <div className="py-1 flex flex-wrap gap-2">
          {listedAmenities.slice(0, 14).map((amenity: any) => (
            <div
              key={amenity.id} // Use a unique key if available
              className="flex items-center justify-center gap-2 p-2 px-3 md:px-5 bg-[#ebfafa] rounded-lg cursor-pointer hover:bg-blue-50 duration-200"
            >
              <div className="hidden md:block h-8 w-8 relative">
                <Image
                  src={amenity.amenity_image}
                  alt={`${amenity.amenity_name} icon`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="font-semibold">{amenity.amenity_name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Show all amenities button */}
      {showButton && !loading && (
        <button
          className="my-1 underline font-semibold text-lg"
          onClick={() => setIsPopupOpen(true)}
        >
          Show all amenities
        </button>
      )}

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div
            ref={popupRef}
            className="bg-white w-[80vw] md:w-[55vw] lg:w-[35vw] h-[80vh] sm:h-[90vh] flex flex-col py-10 rounded-xl sm:rounded-3xl shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-3 text-gray-500 text-3xl font-bold"
              onClick={() => setIsPopupOpen(false)}
            >
              &times;
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-6 md:p-10 pt-6">
              <p className="text-2xl font-bold">All Amenities</p>
              <ul className="py-2 gap-3 mt-4 list-disc pl-4">
                {listedAmenities.map((amenity: any) => (
                  <li key={amenity.id} className="font-semibold p-2">
                    {amenity.amenity_name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
