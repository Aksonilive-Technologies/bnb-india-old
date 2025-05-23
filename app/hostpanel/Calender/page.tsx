"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getListingForOwner } from "@/actions/listing/listing.action";
import DynamicHead from "@/components/DynamicHead";
import Image from "next/image";


export default function Page() {

    const [listings, setListings] = useState([]);

    const handleFetchListings = async () => {
        const data: any = await getListingForOwner();
        if (data.success) {

            setListings(data.data || []);
        }
        // console.log(data);

    };
    useEffect(() => {
        handleFetchListings()
    }, [])


    return (
        <div className="mt-2 sm:mt-[8vh] min-h-[100vh]">
            <DynamicHead title={"HostPanel - Calendar"} />
            <div className="container mx-auto p-4">
                <h1 className="text-xl sm:text-2xl font-bold mb-4">Track Property Calendar</h1>
                <div className="bg-white  shadow-md rounded-lg overflow-hidden">
                    {listings?.map((listing: any, index) => (
                        <div key={index}>



                            <div className="flex items-center p-4 border-b border-gray-200">
                                {/* <img src={"https://assets.architecturaldigest.in/photos/62f4d46616c88215b7e80d3b/16:9/w_1615,h_908,c_limit/Step%20into%205%20of%20the%20most%20beautiful%20villas%20in%20Bengaluru.jpg"} alt={listing?.title} className="w-16 h-16 rounded-md object-cover mr-4" /> */}
                                <Image
                                                    src={listing.coverImage}
                                                    alt="Calendar Villa Image"
                                                    width={400}
                                                    height={400}
                                                    className="w-16 h-16 rounded-md object-cover mr-4"
                                                  />
                                <div className="flex-grow">
                                    <h3 className="font-semibold">{listing?.title}</h3>
                                    <p className="text-sm text-gray-500">{listing?.location}</p>
                                </div>

                                <Link href={`/hostpanel/Calender/${listing?.listing_id}`}>
                                    <button className="px-4 py-2 bg-black text-white rounded hover:bg-white hover:text-black border border-black">
                                        View Calendar
                                    </button>
                                </Link>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}





