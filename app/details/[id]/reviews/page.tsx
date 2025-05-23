import Image from "next/image";

import {
  fetchReviewDataForDetailsPage,
  fetchVillaDataForReviewsPage,
  fetchReviewsForReviewsPage,
  fetchRatingDataForReviewsPage
} from "@/actions/review/review.action";

import CircularRating from "@/components/shared/circularRating";
import Navbar from "@/components/shared/navbar/generalNavbar";
import StarRating from "@/components/shared/starRating";
import VillaReviewCard from "@/components/shared/villaReviewCard";
import DynamicHead from "@/components/DynamicHead";

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

interface RatingData1 {
  avg_star_1: number;
  avg_star_2: number;
  avg_star_3: number;
}

interface VillaData {
  title: String;
  topImage: String;
}

export default async function reviews({ params, searchParams }: any) {
  const id = params.id;

  
    const VillaReviewData: ListingReviewData[] = await fetchReviewsForReviewsPage(id)
    const villaReviewData2: ListingReviewData2[] = await fetchReviewDataForDetailsPage(id)
    const villaRatingdata: RatingData1[] = await fetchRatingDataForReviewsPage(id)
  const villaData: any = await fetchVillaDataForReviewsPage(id)

  return (
    <div className="min-h-[100vh]">
      <DynamicHead title={`Reviews | ${villaData[0].title || ''}`} />
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center gap-3 lg:gap-10 h-full">
        <div className="h-full mx-h-[100vh] md:sticky top-16 flex md:flex-col md:min-h-[90vh] gap-1 px-2 lg:px-6">
         <div className="hidden md:block">
         <div className="w-16 h-16 md:w-40 md:h-40 xl:w-64 xl:h-60 bg-blue-300 rounded-lg mt-6 overflow-hidden ">
            <Image
              src={villaData[0].coverImage}
              alt="villa image"
              width={300}
              height={300}
              className="object-cover  w-full h-full"
            />
          </div>
          <p className="text-lg font-semibold">{villaData[0].title}</p>
          </div> 

          <div className="flex flex-col">
            <div className="mb-2 mt-4">
              <h2 className="text-lg font-semibold">Ratings and Reviews</h2>
              <div>
                <p>
                {villaReviewData2[0].review_total} stars{" "}
                  <span className="text-xs font-semibold text-gray-400">
                  ({`${villaReviewData2[0].review_count} ratings`})
                  </span>
                </p>
                <StarRating rating={4} size={5} />
                <p className="py-1 flex gap-3">{`${villaReviewData2[0].review_count} reviews`}{" "} </p>
              </div>
            </div>

            <div className="flex flex-wrap md:block">
              <CircularRating value={villaRatingdata[0].avg_star_1} text="Stay Experience" />
              <CircularRating value={villaRatingdata[0].avg_star_2} text="cleanliness" />
              <CircularRating value={villaRatingdata[0].avg_star_3} text="Value for Money" />
              {/* <CircularRating value={4.2} text="Host" /> */}
            </div>
          </div>
        </div>
        <div className="w-full md:w-[65%] px-4">
          <h1 className="p-4 text-lg font-semibold">
            Villa name - Guest reviews
          </h1>
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
      </div>
    </div>
  );
}

