import Image from "next/image";
import Link from "next/link";
import { fetchReviewsForDetailsPage, fetchReviewDataForDetailsPage } from '@/actions/review/review.action'

import {
  getImagesById,
  getListingById,
} from "@/actions/listing/listing.action";
import { LayoutDashboard } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { MdOutlineImageNotSupported } from "react-icons/md";


import ClientElementCaller from "@/components/shared/map/clientElementCaller";
import Navbar from "@/components/shared/navbar/generalNavbar";
import ReadMoreComponet from "@/components/shared/readMoreComponent";
import ReservationCard from "@/components/shared/reservationCard";
import StarRating from "@/components/shared/starRating";
import VillaReviewCard from "@/components/shared/villaReviewCard";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

import ShareNlike from "../components/shareNLike";
import BootomBar from "@/components/shared/BootomBar";

import DynamicHead from "@/components/DynamicHead";
import ListingAmmentities from "./ammenities";




export default async function detailsPage({ params, searchParams }: any) {
  interface ListingDataInf {
    listing_id: string;
    host_id: string;
    title: string;
    description: string;
    isListed: boolean;
    address: string;
    city: string;
    area_name: string;
    state: string;
    latitude: string;
    longitude: string;
    maxGuests: number;
    numberOfBedrooms: number;
    numberOfBeds: number;
    numberOfBathrooms: number;
    pricePerDay: number;
    pricePerGuest?: number;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
  }

  interface ListingReviewData {
    name: string;
    profile_image: string;
    rating: number;
    comment: string;
    time: string;
  }

  interface ListingReviewData2 {
    reviews_total_id: String;
    review_total: Float32Array;
    review_count: Number;
    pointer_table_id: String;
    pointer_table_name: String;
  }

  var imageCount = 0;
  const id = params.id;
  console.log(id);

  const Listingdata: any = await getListingById(id);


  const villaimages = await getImagesById(id);
  // console.log({villaimages})

  const coordinates: [number, number] = [
    Number(Listingdata[0]?.latitude), // Access first element of array
    Number(Listingdata[0]?.longitude),
  ];

  if (villaimages == null) {
    imageCount = 0;
  } else {
    imageCount = villaimages.length;
  }

  const VillaReviewData: ListingReviewData[] = await fetchReviewsForDetailsPage(id)
  const villaReviewData2: ListingReviewData2[] = await fetchReviewDataForDetailsPage(id)

  return (
    <>
      <DynamicHead title={Listingdata[0]?.title} />
      <Navbar />

      <div className="mt-4 w-full flex flex-col items-center ">
        <div className="w-[96%] sm:w-[90%]">
          <div className="flex flex-col-reverse sm:flex-col">
            <div className="w-full flex justify-between items-center pb-2 px-1">
              <div>
                <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold">
                  {Listingdata[0]?.title}
                </h1>
                <p className="text-gray-500 text-sm md:text-lg">
                  {Listingdata[0]?.city}, {Listingdata[0]?.state}
                </p>
              </div>

              <ShareNlike VillaId={id} />
            </div>

            <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] flex gap-2 ">
              <div className="w-full h-full  rounded-2xl relative overflow-hidden">
                {imageCount == 0 ? null : (
                  <Link href={`../details/${id}/gallery`}>
                    <button className="absolute p-1 md:p-2  z-10 bottom-0 m-1 flex gap-1 bg-white text-black font-bold text-sm items-center rounded-lg ">
                      <LayoutDashboard className="text-gray-400 w-6 md:w-8" />
                      <p className="hidden md:block">show all photos</p>
                    </button>
                  </Link>
                )}
                {imageCount === 0 ||
                  !villaimages ||
                  villaimages.length === 0 ? (
                  <div className="w-full bg-gray-100 flex justify-center items-center h-full flex-col text-gray-700">
                    <MdOutlineImageNotSupported size={30} />
                    <p className="p-2 text-lg">
                      Sorry, this villa doesn&apos;t have any images uploaded.
                    </p>
                  </div>
                ) : (
                  <Image
                    src={villaimages[0]["image_url"] as string}
                    alt={`villa image ${villaimages[0]["villaImage_uid"]}`}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div
                className={
                  imageCount <= 2
                    ? "hidden"
                    : imageCount <= 4
                      ? `w-[30%] h-full hidden sm:grid  grid-cols-1 grid-rows-${imageCount - 2} xl:grid-cols-1 xl:grid-rows-${imageCount - 1} gap-2`
                      : "w-[70%] h-full hidden sm:grid  grid-cols-1 grid-rows-3 xl:grid-cols-2 xl:grid-rows-2 gap-2"
                }
              >
                {villaimages &&
                  villaimages.length > 1 &&
                  villaimages.slice(1, 5).map((d, index) => (
                    <div
                      key={index}
                      className="w-full h-full rounded-xl relative overflow-hidden"
                    >
                      {d.image_url ? (
                        <Image
                          src={d.image_url}
                          alt={`villa image ${d.villaImage_uid}`}
                          width={600}
                          height={600}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex justify-center items-center text-gray-700">
                          <MdOutlineImageNotSupported size={30} />
                          <p className="p-2 text-lg">Image not available</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div id="parentDiv" className="flex w-full py-2 gap-2">
            <div className="h-full w-full p-2 flex flex-col ">
              {Listingdata[0] && (
                <p className="text-sm md:text-lg font-semibold">
                  {[
                    Listingdata[0].maxGuests > 0 &&
                    `${Listingdata[0].maxGuests} guests`,
                    Listingdata[0].numberOfBedrooms > 0 &&
                    `${Listingdata[0].numberOfBedrooms} bedrooms`,
                    Listingdata[0].numberOfBeds > 0 &&
                    `${Listingdata[0].numberOfBeds} beds`,
                    Listingdata[0].numberOfBathrooms > 0 &&
                    `${Listingdata[0].numberOfBathrooms} bathrooms`,
                  ]
                    .filter(Boolean)
                    .join(" . ")}
                </p>
              )}
              {villaReviewData2[0] ? <div className="flex items-center pt-1">
                <FaStar className="size-5" />
                <p className="px-2">{villaReviewData2[0].review_total}</p>
                <Link href="#reviews">
                  <p className="pl-2 hover:underline">{`${villaReviewData2[0].review_count} reviews`} </p>

                </Link>
              </div> : <p>No reviews</p>}

              <hr className="border-[1px]  border-gray-300  my-4" />

              <div className="flex items-center justify-between gap-2 w-full">
                <Link
                  href={`../users/${Listingdata[0]?.host_id}`}
                  className="flex flex-row gap-3 items-center " >
                  <button className="rounded-full w-14 h-14 relative overflow-hidden">
                    <Image
                      src={Listingdata[0]?.profile_image}
                      alt="Host image"
                      width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    />
                  </button>
                  <p className="font-semibold text-gray-700">
                    Hosted By <span className="font-bold text-gray-900">{Listingdata[0]?.first_name} {Listingdata[0]?.last_name}</span>
                  </p>
                </Link>
                <Link href={{ pathname: `/chat/chatwindow/${Listingdata[0]?.host_id}`, query: { stay: Listingdata[0]?.title, id: id } }} className="flex gap-2 items-center text-gray-900">
                  <p className="hidden md:block">Chat</p>
                  <IoChatbubbleEllipsesOutline size={26} />
                </Link>
              </div>


              <hr className="border-[1px]  border-gray-300  my-8" />

              <div>
                {/* <h2 className="text-xl font-semibold my-3">About This Stay</h2> */}
                <div className="pb-2 ">
                  <ReadMoreComponet
                    id="details-description"
                    htmlContent={Listingdata[0]?.description || ''} // Ensure text is always a string
                  />
                </div>
              </div>

              {/* ammenities  */}
              <ListingAmmentities/>


              <div className="w-full mt-5 h-[50vh] bg-blue-100 rounded-lg overflow-hidden">
                <ClientElementCaller
                  elementType={"DISPLAYMAP"}
                  elementValue={coordinates}
                />
              </div>

              <div className="mb-2 mt-8" id="reviews">
                <h2 className="text-lg font-semibold">Ratings and Reviews</h2>
                <p>
                  Get a quick overview of the overall satisfaction from our
                  guests
                </p>

                {villaReviewData2[0] ?
                  <div>
                    <p>
                      {villaReviewData2[0].review_total} stars{" "}
                      <span className="text-xs font-semibold text-gray-400">
                        ({`${villaReviewData2[0].review_count} ratings`})
                      </span>
                    </p>
                    <StarRating rating={villaReviewData2[0].review_total} size={5} />
                    <p className="py-1 flex gap-3">
                      {`${villaReviewData2[0].review_count} reviews`}{" "}
                      <Link
                        href={`../details/${id}/reviews`}
                        className="hover:underline cursor-pointer">
                        view all reviews
                      </Link>
                    </p>
                  </div> : <div><br /><p>This villa has no reviews tills now.</p><p>Be the first one to add it</p></div>
                }
              </div>

              <div>
                {VillaReviewData.map((reviewData, index) => (
                  <VillaReviewCard
                    key={index}
                    image={reviewData.profile_image}
                    name={reviewData.name}
                    rating={reviewData.rating}
                    time={reviewData.time}
            
                    reviewComment={reviewData.comment}
                  />
                ))}
              </div>
            </div>

            <ReservationCard
              propertyId={id}
              villaData={Listingdata[0]}
              pricePerDay={Listingdata[0]?.pricePerDay}
              cancellationType={Listingdata[0]?.cancellationType}
              maxGuest={Listingdata[0]?.maxGuests ? Listingdata[0]?.maxGuests : 0}
              pricePerGuest={
                Listingdata[0]?.pricePerGuest ? Listingdata[0]?.pricePerGuest : 0
              }
            />

            <BootomBar
              Listingdata={Listingdata}
              propertyId={id}
            />
          </div>
        </div>
      </div>
      
    </>
  );
}

