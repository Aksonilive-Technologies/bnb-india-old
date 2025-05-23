"use server";

import { cookies } from "next/headers";

import { decrypt } from "@/utils/Encryption";

import { db } from "@/lib/db";


export const getBookedDates = async () => {
  try {
    const booking = await db.booking.findMany({
      select: {
        checkinDate: true,
        checkoutDate: true,
      },
      where: {
        propertyId: {
          equals: "abc",
        },
      },
    });
    return booking;
  } catch (error) {
    return null;
  }
};

export const getDisabledDates = async (propertyId: String) => {
  try {
    const conflictingBookings: any =
      await db.$queryRaw`select "date" from "HotelPriceData" hpd where villa_id = ${propertyId} and "blockNight" = true AND "date" > CURRENT_DATE`;
    const dates = conflictingBookings.map(
      (conflictingBookingsDate: any) => conflictingBookingsDate.date,
    );

    // Sort the dates to ensure they are in order
    const sortedDates = dates.sort(
      (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
    );

    const sequences: string[][] = [];
    let currentSequence: string[] = [];

    // Create 2D list of sequences
    for (let i = 0; i < sortedDates.length; i++) {
      if (
        i === 0 ||
        new Date(sortedDates[i]).getTime() -
        new Date(sortedDates[i - 1]).getTime() >
        24 * 60 * 60 * 1000
      ) {
        if (currentSequence.length > 0) {
          sequences.push(currentSequence);
        }
        currentSequence = [sortedDates[i]];
      } else {
        currentSequence.push(sortedDates[i]);
      }
    }
    if (currentSequence.length > 0) {
      sequences.push(currentSequence);
    }

    // Remove the first date from each sequence only if the sequence has more than 1 date
    const disabledDates = sequences.flatMap((sequence) =>
      sequence.length > 1 ? sequence.slice(1) : [],
    );

    const checkoutOnlyDates = sequences.flatMap(sequence =>
      sequence.length === 1 ? sequence : []
    );

    return {
      "disabledDates": disabledDates,
      "checkoutOnlyDates": checkoutOnlyDates
    };
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function checkBookingDatesAvailable(
  checkinD: any,
  checkoutD: any,
  propertyId: any,
) {
  try {
    // Convert dates to proper format if necessary
    const startDate = new Date(checkinD);
    const endDate = new Date(checkoutD);

    // Query to find any blocked dates within the range
    const blockedDates = await db.hotelPriceData.findMany({
      where: {
        villa_id: propertyId,
        date: {
          gte: startDate,
          lt: endDate, // less than checkoutD to exclude the end date
        },
        blockNight: true, // Check for blocked nights
      },
    });

    // Determine availability based on blocked dates
    const isAvailable = blockedDates.length === 0;

    return isAvailable;
  } catch (error) {
    console.error("Error checking booking availability:", error);
    return false;
  }
}

export const initializeBooking = async (data: any) => {
  try {
    const encrypted_host_id = (await cookies()).get("encrypted-uid");
    if (!encrypted_host_id) {
      console.error("No encrypted-uid cookie found");
      return { error: "User not authenticated" };
    }

    const user_id: string = await decrypt(encrypted_host_id.value);
    if (!user_id) {
      return { error: "User not authenticated" };
    }

    const { propertyId, ownerId, checkinDate, checkoutDate, adults, children, pets, totalPrice, serviceFee } = data;

    // Validate dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    if (checkin >= checkout) {
      return { error: "Invalid check-in and check-out dates" };
    }

    // Check if the dates are available for the given property
    const isAvailable = await checkBookingDatesAvailable(checkin, checkout, propertyId);
    if (!isAvailable) {
      return { error: "Dates are not available" };
    }


    // Create the booking entry in the database
    const booking = await db.booking.create({
      data: {
        userId: user_id,
        propertyId,
        ownerId, // Provided as part of the input data
        checkinDate: checkin,
        checkoutDate: checkout,
        adults,
        children,
        pets,
        totalPrice,
        status: "Pending",
        serviceFee,
        transactionID: "", // Include the generated transaction ID
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    // // Block the dates in the pricing table
    // let currentDate = new Date(checkin);
    // while (currentDate < checkout) {
    //   await db.hotelPriceData.create({
    //     data: {
    //       villa_id: propertyId,
    //       date: currentDate,
    //       pricingDetails: { price: totalPrice / (adults + children + 1), discount: 0, minBookingDays: 1 },
    //       blockNight: true,
    //     },
    //   });

    //   // Move to the next day
    //   currentDate.setDate(currentDate.getDate() + 1);
    // }

    return {
      success: true,
      message: "intialised Booking successfully",
      booking: booking,
      // transactionID,
    };
  } catch (error) {
    console.error("Error creating Booking:", error);
    return { success: false, error: "Failed to create Booking" };
  }
};



export async function fetchBookingforUser() {
  const encrypted_host_id = (await cookies()).get("encrypted-uid");
  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { status: false, error: "User not authenticated" };
  }

  const user_id: string = await decrypt(encrypted_host_id.value);
  if (!user_id) {
    return { status: false, error: user_id + "User not there" };
  }
  console.log("start fetching booking for user")
  try {
    const BookingforUser: any[] = await db.$queryRaw`
          SELECT 
          b.id as bookingId,
              b."propertyId" AS villaId,
              l.title AS villaName,
              l.city AS city,
              l.state AS state,
              b."totalPrice" AS BookingAmount,
              b."checkinDate" AS checkinDate,
              b."checkoutDate" AS checkoutdate,
              b."createdAt" AS createdAt,
              l.title AS villaName,
              l.address,
              l.city,
              l.state,
              b.status,
              b."transactionID"
          FROM 
              "Booking" b 
          LEFT JOIN 
              "Listing" l 
          ON 
              b."propertyId" = l.listing_id
          WHERE 
              b."userId" = ${user_id}
          ORDER BY 
              b."createdAt" DESC;
      `;

    console.log("bookings for user are", BookingforUser);

    return { status: true, BookingforUser: BookingforUser || [] };
  } catch (error) {
    console.error("Error fetching distinct Booking for User:", error);
    return { status: false, error: error };
  }
}

export async function fetchBookingforOwnerAtMybooking() {
  const encrypted_host_id = (await cookies()).get("encrypted-uid");
  if (!encrypted_host_id) {
    console.error("No encrypted-uid cookie found");
    return { status: false, error: "User not authenticated" };
  }

  const user_id: string = await decrypt(encrypted_host_id.value);
  if (!user_id) {
    return { status: false, error: user_id + "User not there" };
  }
  console.log("start fetching booking for Owner")
  try {


    const BookingforUser: any[] = await db.$queryRaw`
    SELECT 
    b.id as bookingId,
        b."propertyId" AS villaId,
        l.title AS villaName,
        l.city AS city,
        l.state AS state,
        b."totalPrice" AS BookingAmount,
        b."checkinDate" AS villaBookedDate,
        b."checkoutDate" AS checkoutdate,
        l.title AS villaName,
        l.address,
        l.city,
        l.state,
        b.status,
         b."transactionID"
    FROM 
        "Booking" b 
    LEFT JOIN 
        "Listing" l 
    ON 
        b."propertyId" = l.listing_id
    WHERE 
        l."host_id" = ${user_id}
      AND
        b."status" != 'Pending'
    ORDER BY 
      b."checkinDate" DESC;
`;

    // console.log("bookings for user are", BookingforUser);


    // Ensure 'locations' is of the expected type
    // console.log({BookingforUser})
    return { status: true, BookingforUser: BookingforUser || [] };
  } catch (error) {
    console.error("Error fetching distinct Booking for User:", error);
    // throw new Error("Failed to fetch Booking for User");
    return { status: false, error: error };
  }
}

export async function fetchBookingForOwner() {
  const encryptedHostId = (await cookies()).get("encrypted-uid");
  if (!encryptedHostId) {
    console.error("No encrypted-uid cookie found");
    return { success: false, error: "User not authenticated" };
  }

  const userId: string = await decrypt(encryptedHostId.value);
  if (!userId) {
    return { success: false, error: "User not found" };
  }

  try {
    const bookings: any[] = await db.booking.findMany({
      where: { ownerId: userId },
    });

    const userCache = new Map<string, any>();
    const villaCache = new Map<string, any>();

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      // if (bookings[i].status !== 'Confirmed') {
      //   continue;
      // }
      if (!userCache.has(booking.userId)) {
        const userData = await db.users.findUnique({
          where: { user_id: booking.userId },
        });
        if (userData) {
          userCache.set(booking.userId, userData);
        }
      }

      const cachedUserData = userCache.get(booking.userId);
      // console.log("cachedUserData",cachedUserData)
      if (cachedUserData) {
        booking.name = `${cachedUserData.first_name} ${cachedUserData.last_name}`;
      }

      if (!villaCache.has(booking.propertyId)) {
        const villaData = await db.listing.findUnique({
          where: { listing_id: booking.propertyId },
        });
        if (villaData) {
          villaCache.set(booking.propertyId, villaData);
        }
      }
      const cachedVillaData = villaCache.get(booking.propertyId);
      if (cachedVillaData) {
        booking.villa_name = cachedVillaData.title;
      }
    }

    console.log("logs of booking are ", bookings);
    return { success: true, bookings };
  } catch (error) {
    console.error("Error fetching bookings for the owner:", error);
    return { success: false, error: "Failed to fetch bookings for user" };
  }
}
export async function fetchBookingByID(id: string) {
  try {
    // Fetch booking by ID
    const booking = await db.booking.findUnique({
      where: { id: id },
    });

    // Handle the case where no booking is found
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    console.log("Booking found:", booking);
    return { success: true, booking };
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return { success: false, error: "Failed to fetch booking" };
  }
}

export async function getreciptData(bookingId: any) {
  try {
    // Fetch the booking details

    const encrypted_host_id = (await cookies()).get("encrypted-uid");
    if (!encrypted_host_id) {
      console.error("No encrypted-uid cookie found");
      return { success: false, error: "User not authenticated" };
    }

    const user_id: string = await decrypt(encrypted_host_id.value);
    const booking: any = await db.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking.userId !== user_id && booking.ownerId !== user_id) {
      console.error("User not authorized to view this booking");
      return { success: false, error: "User not authorized" };
    }
    if (!booking) {
      console.error(`Booking with ID ${bookingId} not found.`);
      return {
        success: false,
        error: `Booking with ID ${bookingId} not found.`,
      };
    }

    // Fetch the owner details
    const owner: any = await db.users.findUnique({
      where: { user_id: booking.ownerId },
    });

    if (!owner) {
      console.error("Owner not found");
    }

    // Fetch the villa (listing) details
    const villa = await db.listing.findUnique({
      where: { listing_id: booking.propertyId },
    });

    if (!villa) {
      console.error(`Villa with ID ${booking.propertyId} not found.`);
    }

    // Fetch the transaction details
    const transaction: any = await db.transactionDetails.findMany({
      where: { booking_id: booking.id },
    });

    if (!transaction) {
      console.error(
        `Transaction details for booking ID ${booking.id} not found.`,
      );
    }

    // Fetch the user details
    const user: any = await db.users.findUnique({
      where: { user_id: booking.userId },
    });

    if (!user) {
      console.error(`User with ID ${booking.userId} not found.`);
    }

    const addreviewflag: any =
      await db.$queryRaw`SELECT 
      CASE 
          WHEN COUNT(vr.villareviews_id) = 0 AND CURRENT_DATE > MAX(b."checkoutDate") THEN 'True' 
          ELSE 'False' 
      END AS addreviewflag
  FROM "Booking" b 
  LEFT JOIN "villaReviews" vr 
      ON b.id = vr."bookingId" 
      AND b."propertyId" = vr."villaId" 
      AND b."userId" = vr.user_id 
  WHERE b.id = ${booking.id}
  AND b."propertyId" = ${booking.propertyId}
  AND b."userId" = ${booking.userId} and b.status = 'Confirmed'`;

    console.log("Booking Id", booking.id)
    console.log("Villa Id", booking.propertyId)
    console.log("User Id", booking.userId)
    console.log("Review Flag", addreviewflag)

    // Combine all the details into a single object
    const result = {
      booking,
      villa,
      transaction,
      owner,
      user,
      addreviewflag, // Include the user details in the result
    };


    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return { success: false, error };
  }
}


export async function CalculatePrice(data: any) {
  console.log(data);
  
  const { propertyId, checkinDate, checkoutDate, adults, children, pets } = data;

  try {
    // Parse dates
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);

    // Fetch the listing details for default price and settings
    const listing = await db.listing.findUnique({
      where: { listing_id: propertyId },
    });

    if (!listing) {
      throw new Error("Property not found");
    }

    // Fetch overridden pricing details from HotelPriceData
    const overriddenPrices = await db.hotelPriceData.findMany({
      where: {
        villa_id: propertyId,
        date: {
          gte: checkin,
          lt: checkout,
        },
      },
    });

    // Create a map of overridden prices for quick lookup
    const priceMap: Record<string, number> = {};
    overriddenPrices.forEach((priceData: any) => {
      priceMap[new Date(priceData.date).toISOString().split("T")[0]] = priceData.pricingDetails?.price || listing.pricePerDay;
    });

    // Calculate total price
    let totalPrice = 0;
    for (
      let date = new Date(checkin);
      date < checkout;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = date.toISOString().split("T")[0];
      totalPrice += priceMap[dateKey] || listing.pricePerDay; // Fallback to listing.pricePerDay
    }

    // Add price for additional guests if applicable
    // const totalGuests = adults + children + pets;
    // if (totalGuests > listing.minGuests) {
    //   totalPrice +=
    //     (totalGuests - listing.minGuests) * listing.pricePerGuest ;
    // }

    return { success: true, totalPrice };
  } catch (error) {
    console.error("Error calculating price:", error);
    return { success: false, error: error || "Failed to calculate price" };
  }
}

import { subDays } from "date-fns";

export async function recentDataForOwner() {
  try {
    // Get encrypted host ID from cookies
    const encryptedHostId = (await cookies()).get("encrypted-uid");
    if (!encryptedHostId) {
      console.error("No encrypted-uid cookie found");
      return { success: false, error: "User not authenticated" };
    }

    const userId: string = await decrypt(encryptedHostId.value);
    if (!userId) {
      return { success: false, error: "User not found" };
    }

    const past30Days = subDays(new Date(), 30);
    const bookings = await db.booking.findMany({
      where: {
        ownerId: userId,
        createdAt: { gte: past30Days },
      },
    });

    // Fetch all cancellations within last 30 days
    const cancelledBookings = await db.booking.findMany({
      where: {
        ownerId: userId,
        status: "cancelled",
        updatedAt: { gte: past30Days },
      },
    });

    // Fetch reviews related to the host's villas
    const reviews = await db.villaReviews.findMany({
      where: {
        villaId: {
          in: bookings.map((b: any) => b.propertyId),
        },
        createdAt: { gte: past30Days },
      },
    });
    console.log({
      totalBookings: bookings.length,
      totalCancellations: cancelledBookings.length,
      totalReviews: reviews.length,
      // bookings,
      // cancelledBookings,
      // reviews,
    })
    return {
      success: true,
      data: {
        totalBookings: bookings.length,
        totalCancellations: cancelledBookings.length,
        totalReviews: reviews.length,
        // bookings,
        // cancelledBookings,
        // reviews,
      },
    };
  } catch (error) {
    console.error("Error fetching recent data:", error);
    return { success: false, error: "Internal server error" };
  }
}
