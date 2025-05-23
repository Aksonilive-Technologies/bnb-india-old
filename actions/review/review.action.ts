"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/utils/Encryption";

import { db } from "@/lib/db";

interface countInterface {
  count: number; // Use number since COUNT returns an integer
}

export const reviewsTotalFunction = async (
  pointer_table_id: string,
  pointer_table_name: string,
  reviewSum: number,
) => {
  const reviewsTotalData = await db.$queryRaw<
    any[]
  >`select * from "reviewsTotal" rt where rt.pointer_table_id = ${pointer_table_id} `;

  var updatedReviewTotal =
    reviewsTotalData[0].review_total * reviewsTotalData[0].review_count +
    reviewSum;

  const updateReviewCount = reviewsTotalData[0].review_count + 1;
  updatedReviewTotal = updatedReviewTotal / updateReviewCount;
  updatedReviewTotal = parseFloat(updatedReviewTotal.toFixed(1));

  const reviewsTotalUpdateQuery = await db.$queryRaw<any[]>`
    update "reviewsTotal" set review_total = ${updatedReviewTotal}, review_count = ${updateReviewCount} where pointer_table_id = ${pointer_table_id} and pointer_table_name = ${pointer_table_name} `;
  return { success: true };
};

export const addVillaReview = async (
  data: any,
  villaId: string,
  bookingId: string,
) => {
  const encrypted_host_id = cookies().get("encrypted-uid");
  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { error: "User not authenticated" };
  }

  const user_id: string = await decrypt(encrypted_host_id.value);
  if (!user_id) {
    return { error: user_id + "User not there" };
  }

  const checkIfUserHasBooking = await db.$queryRaw<countInterface[]>`
      SELECT COUNT(b.id) as count 
      FROM "Booking" b 
      WHERE b."userId" = ${user_id} 
        AND b."propertyId" = ${villaId} and b."checkoutDate" < CURRENT_DATE
    `;

  const checkIfUserHasReview = await db.$queryRaw<countInterface[]>`
        select COUNT(villareviews_id) as count  from "villaReviews" vr where user_id = ${user_id} and "villaId" = ${villaId}`;

  // Check if the result array is not empty and get the count
  const userBookingcount = checkIfUserHasBooking[0]?.count ?? 0;

  if (userBookingcount < 1) {
    return { error: "User doesn't have booking for" + villaId + "villa" };
  }

  const userReviewcount = checkIfUserHasReview[0]?.count ?? 0;

  if (userReviewcount > 1) {
    return { error: "User already have a review for" + villaId + "villa" };
  }

  try {
    const addVillaReview: any = await db.villaReviews.create({
      data: {
        villaId: villaId,
        bookingId: bookingId,
        user_id: user_id,
        star_1: data.cleanliness,
        star_2: data.communication,
        star_3: data.houserules,
        review_1: data.description,
        review_2: "",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    const reviewTotal =
      (data.cleanliness + data.communication + data.houserules) / 3;
      reviewsTotalFunction(villaId, "villa", reviewTotal);
    return { success: true };
  } catch (error) {
    console.error("Error creating addVillaReview:", error);
    return { error: "Failed to create addVillaReview" };
  }
};

export const addHostReview = async (
  data: any,
  userId: string,
  hostId: string,
) => {
  try {
    const addHostReview: any = await db.hostReviews.create({
      data: {
        user_id: userId,
        host_id: hostId,
        star_1: data.star_1,
        star_2: data.star_2,
        star_3: data.star_3,
        review_1: data.review_1,
        review_2: "",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Error creating addHostReview:", error);
    return { error: "Failed to create addHostReview" };
  }
};

interface ListingData {
  count: number;
  listing_id: string;
  review_total: number;
  title: string;
  topImage: boolean;
}

export const getListingByIdForReviewPage = async (
  id: string,
): Promise<ListingData[]> => {
  try {
    const listings = await db.$queryRaw<any[]>`
        SELECT l.listing_id, l.title, 
               vi."topImage", 
               rt.review_total, 
               rt.review_count as count 
        FROM "Listing" l 
        LEFT JOIN "VillaImages" vi 
          ON vi.villa_id = l.listing_id AND vi."topImage" = 'True'
        LEFT JOIN "reviewsTotal" rt 
          ON rt.pointer_table_id = l.listing_id
        WHERE l.listing_id = ${id}
        GROUP BY l.listing_id, l.title, vi."topImage", rt.review_total,rt.review_count;
      `;
    // Convert count to a regular number
    return listings.map((listing) => ({
      ...listing,
      count: Number(listing.count),
    }));
  } catch (error) {
    console.error("Error fetching villa details in villa review page:", error);
    throw new Error("Failed to fetch villa details villa review page");
  }
};

export const fetchReviewsForDetailsPage = async (id: string) => {
  interface ListingReviewData {
    name: string;
    profile_image: string;
    rating: number;
    comment: string;
    time: string;
  }

  try {
    const fetchReviews = await db.$queryRaw<ListingReviewData[]>`
      SELECT 
      u.first_name || ' ' || u.last_name AS name,
      u.profile_image,
      ROUND((vr.star_1 + vr.star_2 + vr.star_3) / 3.0, 1) AS rating, 
      vr.review_1 AS comment,
      to_char(vr."updatedAt", 'Mon, YYYY') AS time
      FROM "villaReviews" vr
      INNER JOIN users u ON u.user_id = vr.user_id 
      WHERE vr."villaId" = ${id}
      ORDER BY rating DESC LIMIT 6;`;

    return fetchReviews;
  } catch (error) {
    console.error("Error fetching villa review details:", error);
    throw new Error("Failed to fetch villa review details");
  }
};

export const fetchReviewsForReviewsPage = async (id: string) => {
  interface ListingReviewData {
    name: string;
    profile_image: string;
    rating: number;
    comment: string;
    time: string;
  }

  try {
    const fetchReviews = await db.$queryRaw<ListingReviewData[]>`
      SELECT 
      u.first_name || ' ' || u.last_name AS name,
      u.profile_image,
      ROUND((vr.star_1 + vr.star_2 + vr.star_3) / 3.0, 1) AS rating, 
      vr.review_1 AS comment,
      to_char(vr."updatedAt", 'Mon, YYYY') AS time
      FROM "villaReviews" vr
      INNER JOIN users u ON u.user_id = vr.user_id 
      WHERE vr."villaId" = ${id}
      ORDER BY rating DESC;`;

    return fetchReviews;
  } catch (error) {
    console.error("Error fetching villa review details:", error);
    throw new Error("Failed to fetch villa review details");
  }
};

export const fetchReviewDataForDetailsPage = async (id: string) => {
  interface ListingReviewData {
    reviews_total_id: String;
    review_total: Float32Array;
    review_count: Number;
    pointer_table_id: String;
    pointer_table_name: String;
  }

  try {
    const fetchReviewsData = await db.$queryRaw<
      ListingReviewData[]
    >`select reviews_total_id,review_total,review_count,pointer_table_id,pointer_table_name
       from "reviewsTotal" rt where pointer_table_id = ${id}`;
    return fetchReviewsData;
  } catch (error) {
    console.error("Error fetching villa review details:", error);
    throw new Error("Failed to fetch villa review details");
  }
};

export const getInfluencersReview = async () => {
  try {
    const getInfluencersReview: any = await db.$queryRaw`
      SELECT 
    ir.influencersreviews_id, 
    ir.reviews_id, 
    vr.review_1, 
    TO_CHAR(vr."updatedAt", 'DD Mon YYYY') AS "updatedAt",
    COALESCE(u.first_name, '') AS first_name, 
    COALESCE(u.last_name, '') AS last_name, 
    COALESCE(u.profile_image, '') AS profile_image, 
    COALESCE(l.title, '') AS title
    FROM 
        "influencersReview" ir
    LEFT JOIN 
        "villaReviews" vr ON vr.villareviews_id = ir.reviews_id
    LEFT JOIN 
        users u ON u.user_id = vr.user_id
    LEFT JOIN 
        "Listing" l ON l.listing_id = vr."villaId";

        `;
    return getInfluencersReview;
  } catch (error) {
    console.error("Error creating getInfluencersReview:", error);
    return { error: "Failed to create getInfluencersReview" };
  }
};

export const fetchVillaDataForReviewsPage = async (id: string) => {
  interface VillaData {
    title: String;
    image_url: String;
  }

  try {
    const fetchVillaData =
      await db.$queryRaw<VillaData>`select l.title, l."coverImage" from "Listing" l 
      where listing_id = ${id}`;
    return fetchVillaData;
  } catch (error) {
    console.error("Error fetching villa Name:", error);
    throw new Error(
      "Failed to fetch villa Name in fetchVillaDataForReviewsPage",
    );
  }
};

export const fetchRatingDataForReviewsPage = async (id: string) => {
  interface RatingData {
    avg_star_1: number;
    avg_star_2: number;
    avg_star_3: number;
  }

  try {
    const fetchRatingDataForReviewsPage = await db.$queryRaw<
      RatingData[]
    >`SELECT AVG(star_1) AS avg_star_1, 
      AVG(star_2) AS avg_star_2, 
      AVG(star_3) AS avg_star_3
          FROM "villaReviews" vr
          INNER JOIN users u ON u.user_id = vr.user_id 
          WHERE vr."villaId" = ${id}`;
    return fetchRatingDataForReviewsPage;
  } catch (error) {
    console.error("Error fetching villa Rating:", error);
    throw new Error(
      "Failed to fetch villa Rating in fetchRatingDataForReviewsPage",
    );
  }
};

export const fetchReviewForOwner = async () => {
  try {
    const cookiesData = await cookies(); // Resolve the promise
    const encrypted_host_id = cookiesData.get("encrypted-uid");

    if (!encrypted_host_id) {
      console.error("No encrypted-uid cookie found");
      return { error: "User not authenticated" };
    }

    const userId: string = await decrypt(encrypted_host_id.value);

    const villaReviews: any[] = await db.$queryRaw`
      SELECT 
          vr.*, 
          CONCAT(u.first_name, ' ', u.last_name) AS "reviewedBy",
          u.profile_image AS "reviewerImage",
          l.title AS "villaName",
          'villaReview' AS "type"
      FROM 
          "villaReviews" vr
      LEFT JOIN 
          "Listing" l 
          ON 
          vr."villaId" = l."listing_id"
      LEFT JOIN 
          "users" u 
          ON 
          vr."user_id" = u."user_id"
      WHERE 
          l."host_id" = ${userId}
      ORDER BY 
          vr."updatedAt" DESC;
    `;

    return { success: true, data: villaReviews };
  } catch (error) {
    console.error("Error fetching reviews for owner:", error);
    return {
      success: false,
      error:
        "An error occurred while fetching reviews. Please try again later.",
    };
  }
};
