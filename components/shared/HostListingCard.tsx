import React, { useState } from 'react';
import Link from "next/link";
import Image from 'next/image';

interface ListingCardProps {
  id: string;
  listing: string;
  location: string;
  status: string;
  image: string;
}


const ListingCard: React.FC<ListingCardProps> = ({ id, listing, location, status, image }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Listed':
        return 'text-green-500';
      case 'In progress':
        return 'text-orange-500';
      case 'Unlisted':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  // console.log("Villa Card Id",id)

  return (
    <>
      <Link href={`/hostpanel/listings/update/${id}`}>
        <div className="flex shadow-[0_8px_30px_rgb(0,0,0,0.12)]  items-center p-4 border-b border-[1px] rounded-md border-gray-300 ">
          {/* <img src={image} alt={listing} className="w-16 h-16 rounded-md object-cover mr-4" />
         */}
          <ImageWithFallback image={image} listing={listing} />
          <div className="flex-grow">
            <h3 className="font-semibold">{listing}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
          <div>
            <span className={`text-sm font-semibold ${getStatusColor(status)}`}>
              {status}
            </span>
          </div>
        </div>
      </Link>
    </>
  );
};

const ImageWithFallback = ({ image, listing }: { image: string; listing: string }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <>
      {!hasError ? (
        <Image
          src={image}
          alt={listing || "Image"}
          width={64}
          height={64}
          className="w-16 h-16 rounded-md object-cover mr-4"
          onError={() => setHasError(true)} // Trigger fallback if image fails to load
        />
      ) : (
        <div
          className="w-16 h-16 rounded-md bg-gray-200 mr-4 flex items-center justify-center"
        >
          {/* Optional: Add a placeholder icon or text */}
          <span className="text-center text-gray-400">No Cover</span>
        </div>
      )}
    </>
  );
};
export default ListingCard;
