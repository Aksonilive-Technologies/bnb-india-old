"use server"
import { db } from "@/lib/db";

import { createListingSchema } from "./validations";
import { createListingType } from "./validations";
import { parse } from "date-fns";
import { Item } from "@radix-ui/react-dropdown-menu";
import { date } from "zod";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/Encryption";


export const getListings = async (
  adults: any,
  children: any,
  pets: any,
  checkin: any,
  checkout: any,
  location: any,
  actualCategory: any,
  placeType: any,
  priceRange: any,
  amenities: any,
  bedroomCount: any,
  bedcount: any,
  bathroomcount: any,
  familyonly: any,
  bnbverified: any,
  sort: any
) => {
  const totalGuests = adults + children + pets;

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);

  try {

    const numberOfDays = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24);

    // Step 1: Find conflicting bookings
    const conflictingBookings = await db.$queryRaw`
      SELECT villa_id 
      FROM "HotelPriceData" hpd
      WHERE "date" >= ${checkinDate} AND "date" < ${checkoutDate} AND hpd."blockNight" = true
    `;

    const propertyIds = Array.isArray(conflictingBookings)
      ? conflictingBookings.map((booking) => booking.villa_id)
      : [];

    // Step 2: Prepare filters
    const listingFilter: any = {
      isListed: true,
      maxGuests: { gte: totalGuests },
    };

    if (actualCategory.length > 0 && actualCategory !== "All") {
      listingFilter.category = {
        contains: actualCategory, // Check if category contains actualCategory
        mode: "insensitive", // Makes the search case-insensitive (optional)
      };
    }

    if (placeType.length > 0 && placeType !== "All") {
      listingFilter.villaType = placeType;
    }

    if (priceRange.length > 0 && priceRange !== "All") {
      const [minPrice, maxPrice] = priceRange.split(",").map(Number);
      listingFilter.pricePerDay = {
        gte: minPrice,
        lte: maxPrice,
      };
    }

    if (amenities.length > 0 && amenities !== "All") {
      const amenityArray = amenities.split("+"); // Example: "ac+pool" => ["ac", "pool"]
      listingFilter.AND = amenityArray.map((amenity: string) => ({
        Amenities: {
          contains: `${amenity}`, // Use the raw value
        },
      }));

    }




    if (bedroomCount && bedroomCount !== "All") {
      listingFilter.numberOfBedrooms = { gte: parseInt(bedroomCount) };
    }

    if (bedcount && bedcount !== "All") {
      listingFilter.numberOfBeds = { gte: parseInt(bedcount) };
    }

    if (bathroomcount && bathroomcount !== "All") {
      listingFilter.numberOfBathrooms = { gte: parseInt(bathroomcount) };
    }

    if (familyonly?.toUpperCase() !== "ALL" && familyonly !== undefined && familyonly !== null) {
      listingFilter.family_only = familyonly === "true";
    }

    if (bnbverified?.toUpperCase() !== "ALL" && bnbverified !== undefined && bnbverified !== null) {
      listingFilter.bnbVerified = bnbverified === "true";
    }

    if (location.length > 0 && location !== "Anywhere") {
      const locationParts = location.split(",").map((part: string) => part.trim());
      if (locationParts.length === 1) {
        listingFilter.OR = [
          { state: { equals: locationParts[0] } },
          { city: { equals: locationParts[0] } },
          { area_name: { equals: locationParts[0] } },
        ];
      } else if (locationParts.length === 2) {
        listingFilter.OR = [
          { state: { equals: locationParts[0] } },
          { city: { equals: locationParts[0] } },
          { area_name: { equals: locationParts[0] } },
          { state: { equals: locationParts[1] } },
          { city: { equals: locationParts[1] } },
          { area_name: { equals: locationParts[1] } },
        ];
      }
    }

    if (propertyIds.length > 0) {
      listingFilter.listing_id = { notIn: propertyIds };
    }

    // Step 3: Fetch listings
    const listings = await db.listing.findMany({
      where: listingFilter,
      orderBy: { pricePerDay: sort },
    });


    // Step 4: Calculate totalPrice for each listing
    const listingsWithTotalPrice = await Promise.all(
      listings.map(async (listing) => {
        const priceOverrides = await db.$queryRaw<Array<{ listing_id: string; totalprice: number | null }>>`
              WITH date_range AS (
                SELECT generate_series(${checkinDate}::DATE, (${checkoutDate}::DATE - INTERVAL '1 day'), '1 day'::INTERVAL) AS date
            )
            SELECT 
                l.listing_id,
                SUM(COALESCE(
                    NULLIF(hpd."pricingDetails"->>'price', '')::FLOAT,
                    l."pricePerDay"
                )) AS totalPrice
            FROM 
                "Listing" l
            JOIN 
                date_range dr ON true -- Pair every listing with all dates in the range
            LEFT JOIN 
                "HotelPriceData" hpd 
                ON l.listing_id = hpd.villa_id 
                AND hpd."date"::DATE = dr.date -- Compare only the date parts
            GROUP BY 
                l.listing_id, l."pricePerDay";
            `;
        const matchingOverride = priceOverrides.find(
          (override) => override.listing_id === listing.listing_id
        );

        const totalPrice = matchingOverride ? matchingOverride.totalprice : 0;

        const reviewsData = await db.$queryRaw<
      Array<{
        reviews_total_id: string;
        review_total: number;
        review_count: number;
        listing_id: string;
        pointer_table_name: string;
      }>
    >`
      SELECT 
        rt.reviews_total_id,
        rt.review_total,
        rt.review_count,
        rt.pointer_table_id AS listing_id,
        rt.pointer_table_name
      FROM "reviewsTotal" rt
      INNER JOIN "Listing" l ON l.listing_id = rt.pointer_table_id
      WHERE l.listing_id = ${listing.listing_id};
    `;

        return {
          ...listing,
          totalPrice,
          basePrice: listing.pricePerDay,
          reviewsData,
        };
      })
    );

    return listingsWithTotalPrice;
  } catch (error) {
    console.error("Error in getListings:", error);
    return null;
  }
};


export const getListingById = async (id: string) => {

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
    bookingType?: string;
    cancellationType?: string;
    profile_image?: string;
  }

  try {
    const listing = await db.$queryRaw<ListingDataInf>`
    select l.*, u.first_name, u.last_name, u.profile_image from "Listing" l 
    inner join users u on u.user_id = l.host_id 
    where listing_id = ${id}
`;

    // console.log({listing})
    return listing;
  } catch (error) {
    console.error('Error fetching villa details:', error);
    throw new Error('Failed to villa details');
  }
};

export const getImagesById = async (id: string) => {
  try {
    const Images = await db.villaImages.findMany({
      where: {
        villa_id: id,
      },
      orderBy: [
        { topImage: 'desc' }, // Ensures topImage: true comes first
      ],
    });

    return Images;
  } catch (error) {
    return null;
  }
};

export const createInitialListing = async (data: createListingType) => {

  try {
    // Validate the incoming data
    const validatedFields = createListingSchema.safeParse(data);

    if (!validatedFields.success) {
      // console.log("Validation errors:", validatedFields.error.format());
      return { error: "Invalid fields" };
    }

    const cookiesData = await cookies(); // Resolve the promise
    const encrypted_host_id = cookiesData.get('encrypted-uid');

    if (!encrypted_host_id) {
      console.error("No encrypted-uid cookie found");
      return { error: "User not authenticated" };
    }


    const host_id: string = await decrypt(encrypted_host_id.value);

    const { address, area_name, city, state, numberOfBedrooms, numberOfBathrooms, numberOfBeds, villaType, zipCode, longitude, latitude } = validatedFields.data;


    const listing: any = await db.listing.create({
      data: {
        host_id: host_id,

        villaType: villaType,

        address: address,
        city: city,
        state: state,
        area_name: area_name,
        latitude: latitude,
        longitude: longitude,
        zipCode: zipCode,
        numberOfBedrooms: numberOfBedrooms,
        numberOfBathrooms: numberOfBathrooms,
        numberOfBeds: numberOfBeds,

        Amenities: '',


        title: '',
        isListed: false,
        description: "",
        maxGuests: numberOfBedrooms * 3,
        minGuests: 1,
        pricePerGuest: 0,
        pricePerDay: 0,
        bookingType: "INSTANT",
        cancellationType: "",

        family_only: false,
        bnbVerified: false,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });




    return { success: true, listing_id: listing.listing_id };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { error: "Failed to create listing" };
  }
};


export const setCoverPic = async (id: string, url: string) => {
  try {

    await db.listing.update({
      where: { listing_id: id },
      data: { coverImage: url },
    });
    ChangeCoverPic(id, url)
    return {
      success: true,
      data: { villaImage_uid: id, image_url: url },
    };
  } catch (error) {
    return { status: "error", data: error }

  }
}
export const ChangeCoverPic = async (id: string, url: string) => {
  try {
    await db.villaImages.updateMany({
      where: { topImage: true },
      data: { topImage: false },
    });

    if (id) {
      console.log("In this function")
      await db.villaImages.updateMany({
        where: { villa_id: id, image_url: url },
        data: { topImage: true },
      });
    }

    return {
      success: true,
      villaId: id || "NA",
    };
  } catch (error: any) {
    return { status: "error", data: error.message };
  }
};

export const deleteImage = async (id: string) => {
  try {
    await db.villaImages.delete({
      where: { villaImage_uid: id },
    });
    return { status: "success", data: { villaImage_uid: id } };
  }
  catch (error) {
    return { status: "error", data: error }
  }
};

export const updateListing = async (listingId: string,
  data: Partial<{
    title: string;
    description: string;
    amenity_name: string[];
    category_code: string[];
    maxGuests: number;
    minGuests: number;
    pricePerGuest: number;
    pricePerDay: number;
    bookingType: string;
    cancellationType: string;
    family_only: boolean;
    bnbVerified: boolean;
    isListed: boolean;
    villaType: string;
    address: string;
    city: string;
    area_name: string;
    state: string;
    zipCode: number;
    numberOfBedrooms: number;
    numberOfBathrooms: number;
    numberOfBeds: number;
    coordinate: [number, number];
  }>) => {
  try {

    // check for auth
    const cookiesData = await cookies(); // Resolve the promise
    const encrypted_host_id = cookiesData.get('encrypted-uid');

    if (!encrypted_host_id) {
      console.error("No encrypted-uid cookie found");
      return { error: "User not authenticated" };
    }


    const host_id: string = await decrypt(encrypted_host_id.value);
    // if (host_id != hostID) {
    //   return { error: "User not Allowed" };
    // }
    // Prepare the update data object
    const updateData: any = {};



    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isListed !== undefined) updateData.isListed = data.isListed;
    if (data.pricePerDay !== undefined) updateData.pricePerDay = data.pricePerDay;
    if (data.maxGuests !== undefined) updateData.maxGuests = data.maxGuests;
    if (data.minGuests !== undefined) updateData.minGuests = data.minGuests;
    if (data.pricePerGuest !== undefined) updateData.pricePerGuest = data.pricePerGuest;
    if (data.bookingType !== undefined) updateData.bookingType = data.bookingType;
    if (data.cancellationType !== undefined) updateData.cancellationType = data.cancellationType;
    if (data.family_only !== undefined) updateData.family_only = data.family_only;
    if (data.bnbVerified !== undefined) updateData.bnbVerified = data.bnbVerified;
    if (data.villaType !== undefined) updateData.villaType = data.villaType;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.area_name !== undefined) updateData.area_name = data.area_name;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zipCode = data.zipCode;
    if (data.numberOfBedrooms !== undefined) updateData.numberOfBedrooms = data.numberOfBedrooms;
    if (data.numberOfBathrooms !== undefined) updateData.numberOfBathrooms = data.numberOfBathrooms;
    if (data.numberOfBeds !== undefined) updateData.numberOfBeds = data.numberOfBeds;
    if (data.coordinate !== undefined) {
      updateData.latitude = data.coordinate[0].toFixed(6);
      updateData.longitude = data.coordinate[1].toFixed(6);
    }


    if (data.amenity_name !== undefined) {
      console.log("Amenity Data", { data: data.amenity_name }); // Optional clearer log
    }

    if (data.category_code !== undefined) {
      console.log("Category Data", { data: data.category_code }); // Optional clearer log

      const categoryString = data.category_code.join(', ');
      updateData.category = categoryString;
    }


    if (data.amenity_name !== undefined) {


      const amenityString = data.amenity_name.join(', ');
      updateData.Amenities = amenityString;
    }
    console.log("Listing Id : ", listingId)
    console.log("Change Data : ", updateData)

    // Update the listing
    const updatedListing = await db.listing.update({
      where: { listing_id: listingId },
      data: updateData,
    });

    return { success: true, updated_listing_id: updatedListing.listing_id };
  } catch (error) {
    console.error("Error updating listing:", error);
    return { error: "Failed to update listing" };
  }
};


export const connectImagestoListing = async (
  villaImages: {
    image_url
    : string
  }[],
  listing_id: string
) => {

  interface VillaImageInsert {
    villaImage_uid?: number;
    villa_id: string;
    image_url: string | null;
    topImage: boolean;
    createdAt: Date;
    updatedAt: Date;
    type: string,
  }

  try {

    const image_list = [];
    for (const villaImage of villaImages) {
      const villaImageInsert = {
        villa_id: listing_id,
        image_url: villaImage.image_url,
        type: "NA",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.villaImages.create({
        data: villaImageInsert,
      });

      // console.log({ result });
      if (!result) {
        return { success: false };
      }
      image_list.push(result)
    }
    return { success: true, data: image_list };
  } catch (error) {
    console.error("Error connecting images to listing:", error);
    return { error: "Failed to connect images to listing", success: false };
  }
};



export async function fetchDistinctLocations() {
  interface Location {
    location: string;
  }

  type Locations = Location[];

  try {
    // Fetch locations from the database
    const locations = await db.$queryRaw<Location[]>`
          SELECT location
          FROM (
              SELECT DISTINCT CONCAT_WS(', ', area_name, city) AS location
              FROM "Listing"
              UNION
              SELECT DISTINCT CONCAT_WS(', ', city, state) AS location
              FROM "Listing"
              UNION
              SELECT DISTINCT state AS location
              FROM "Listing"
          ) AS all_locations;
      `;

    // Ensure 'locations' is of the expected type
    return locations.map((location: Location) => location.location);
  } catch (error) {
    console.error('Error fetching distinct locations:', error);
    throw new Error('Failed to fetch locations');
  }
}



export async function fetchTredingVillas() {

  try {
    // Fetch locations from the database
    const tredingVillas = await db.$queryRaw`
          select l.listing_id as id, l.title as name, l.city as city,l.state as state,l."numberOfBedrooms" as rooms,
          l."pricePerDay" as price, l."coverImage" as image, l.family_only as family_only, l."bnbVerified" as bnbVerified
          from "Listing" l 
          inner join  "tredingVillas" tv on l.listing_id = tv.villa_id
      `;

    // Ensure 'locations' is of the expected type
    // console.log("In Backend Treding villa",{tredingVillas})
    return tredingVillas
  } catch (error) {
    console.error('Error fetching distinct tredingVillas:', error);
    throw new Error('Failed to fetch tredingVillas');
  }
}


export async function fetchLuxuryVillas() {
  try {
    // Fetch listings from luxuryVillas with associated details from Listing
    const fetchLuxuryVillas = await db.$queryRaw`
      SELECT 
        lv."villa_id" AS id, 
        lv.description AS des,
        l.city AS city,
        l.state AS state,
        l.title AS title,
        l."numberOfBedrooms" AS rooms,
        l."pricePerDay" AS price,
        l."coverImage" AS imageurl,
        l."numberOfBeds", 
        l."maxGuests", 
        l."numberOfBathrooms"
      FROM "luxuryVillas" lv
      INNER JOIN "Listing" l ON lv."villa_id" = l."listing_id"
    `;

    return fetchLuxuryVillas;
  } catch (error) {
    console.error('Error fetching luxury villas:', error);
    throw new Error('Failed to fetch luxury villas');
  }
}


export const addWishlistForUser = async (VillaId: string, userId: string) => {

  try {
    const userWishlist: any = await db.userWishlist.create({
      data: {
        villa_id: VillaId,
        user_id: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    console.log(userWishlist);

    return { success: true, data: userWishlist };
  } catch (error) {
    console.error("Error creating listing:", error);
    return { error: "Failed to create listing" };
  }
};


export const deleteWishlistForUser = async (VillaId: string, userId: string) => {

  try {
    const result = await db.userWishlist.deleteMany({
      where: {
        villa_id: VillaId,
        user_id: userId,
      },
    });
    return { success: result.count > 0 };
  } catch (error) {
    console.error("Error deleting listing:", error);
    return { error: "Failed to delete listing" };
  }
};

export const fetchWishlistForUserPerVilla = async (VillaId: string) => {
  const cookiesData = await cookies(); // Resolve the promise
  const encrypted_host_id = cookiesData.get('encrypted-uid');

  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { error: "User not authenticated" };
  }


  const userId: string = await decrypt(encrypted_host_id.value);


  try {

    const userWishlist = await db.userWishlist.findMany({
      where: { user_id: userId, villa_id: VillaId },
      select: {
        userWishlist_id: true,
      },
    });


    if (userWishlist.length === 0) {
      return {
        success: false
      };
    }
    else {
      return {
        success: true
      };
    }

  } catch (error) {
    console.error("Error in fetchWishlistForUserPerVilla:", error);
    return { success: false, error: "Failed to fetch wishlist per villa" };
  }
}



export async function fetchWishlistForUser() {
  const cookiesData = await cookies(); // Resolve the promise
  const encrypted_host_id = cookiesData.get('encrypted-uid');

  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { error: "User not authenticated" };
  }


  const userId: string = await decrypt(encrypted_host_id.value);

  try {
    // Fetch the user's wishlist
    const userWishlist = await db.userWishlist.findMany({
      where: { user_id: userId },
      select: {
        userWishlist_id: true,
        villa_id: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (userWishlist.length === 0) {
      return {
        success: true,
        userWishlist: [],
        message: "No items found in the wishlist",
      };
    }

    // Fetch related listing data for each villa_id
    const villaIds = userWishlist.map((item) => item.villa_id);
    const villaDetails = await db.listing.findMany({
      where: { listing_id: { in: villaIds } }
    });
    console.log(villaDetails)
    // Merge listing data with the wishlist items
    // const enrichedWishlist = userWishlist.map((wishlistItem) => {
    //   const villaData = villaDetails.find(
    //     (villa) => villa.villa_id === wishlistItem.villa_id
    //   );
    //   return {
    //     ...wishlistItem,
    //     villaDetails: villaData || null, // Attach villa data or `null` if not found
    //   };
    // });

    return {
      success: true,
      userWishlist: villaDetails,
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Failed to fetch wishlist" };
  }
};

export const getAllAmmenities = async () => {

  try {
    const AllAmmenities: any = await db.amenities.findMany({});
    return AllAmmenities;
  } catch (error) {
    console.error("Error creating getAllAmmenities:", error);
    return { error: "Failed to create getAllAmmenities" };
  }
};

export const getAllCategories = async () => {

  try {
    const AllCategories: any = await db.category.findMany({});
    return AllCategories;
  } catch (error) {
    console.error("Error creating getAllCategories:", error);
    return { error: "Failed to create getAllCategories" };
  }
};



export const getListingForOwner = async () => {
  const cookiesData = await cookies(); // Resolve the promise
  const encrypted_host_id = cookiesData.get('encrypted-uid');

  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { error: "User not authenticated" };
  }


  const userId: string = await decrypt(encrypted_host_id.value);

  try {
    // Fetch data from the database
    const listings = await db.listing.findMany({
      where: {
        host_id: userId,
      },
    });

    // // Transform data into the required format
    // const formattedListings = listings.map((listing) => ({
    //   id: listing.listing_id,
    //   listing: listing.title,
    //   location: `${listing.area_name}, ${listing.state}`,
    //   status: listing.isListed ? "Listed" : "Unlisted",
    //   image: listing.VillaImages?.[0] || "default-image-url", // Replace with a default image if no image is found
    // }));

    return {
      success: true,
      data: listings,
      message: "Listings fetched and formatted successfully",
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: "Error fetching or formatting listings",
    };
  }
};


export const getListingFor_Particular_Host = async (userId: any) => {
  const cookiesData = await cookies();
  const encrypted_host_id = cookiesData.get("encrypted-uid");

  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { error: "User not authenticated" };
  }

  try {
    // Fetch data from the database
    const listings = await db.listing.findMany({
      where: {
        host_id: userId,
        isListed: true,
      },
    });

    // Ensure the format matches the frontend expectations
    

    return {
      success: true,
      data: listings,
      message: "Listings fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return {
      success: false,
      data: [],
      message: "Error fetching or formatting listings",
    };
  }
};


//   {
//     "id": "clxks4r7h0000k2i7v8vjvlqj",
//     "listing": "AKOYA by Pine Stays",
//     "location": "Karandoli, Maharashtra",
//     "status": "Listed",
//     "image": "https://assets.architecturaldigest.in/photos/62f4d46616c88215b7e80d3b/16:9/w_1615,h_908,c_limit/Step%20into%205%20of%20the%20most%20beautiful%20villas%20in%20Bengaluru.jpg"
//   },
interface VillaImage {
  villaImage_uid: string;
  image_url: string;
}

export const getImagesForVilla = async (id: string): Promise<VillaImage[] | null> => {

  try {
    const imagesForVilla = await db.$queryRaw<VillaImage[]>`
      SELECT "villaImage_uid", image_url 
      FROM "VillaImages" 
      WHERE villa_id = ${id} 
      ORDER BY "topImage" DESC`;
    return imagesForVilla;
  } catch (error) {
    console.error("Error fetching getImagesForVilla:", error);
    return null; // Return `null` on error
  }
};



