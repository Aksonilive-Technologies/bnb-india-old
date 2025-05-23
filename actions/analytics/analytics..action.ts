"use server"

import { db } from "@/lib/db";


export const getAnalyticsDetails = async (userId: string, hostId: string) => {
  try {

    type BookingStat = {
      id: string;
      month: string;
      bookings: number;
      sales: number;
    };


    const bookings = await db.booking.findMany({
      where: {
        userId: userId,
      },
      select: {
        propertyId: true,
        checkinDate: true,
        totalPrice: true,
      },
      orderBy: {
        propertyId: 'asc',
      },
    });

    // Group and aggregate data in JavaScript
    const bookingStatsMap: { [key: string]: BookingStat } = bookings.reduce((acc, booking) => {
      const propertyId = booking.propertyId;
      const month = new Date(booking.checkinDate).toLocaleString('en-US', { month: 'short' });
      const key = `${propertyId}-${month}`;

      if (!acc[key]) {
        acc[key] = { id: propertyId, month: month, bookings: 0, sales: 0 };
      }

      acc[key].bookings += 1;
      acc[key].sales += booking.totalPrice;

      return acc;
    }, {} as { [key: string]: BookingStat });

    const formattedBookingStats = Object.values(bookingStatsMap);


    // Query 2: Total listings
    const totalListings = await db.listing.count({
      where: {
        host_id: hostId,
      },
    });

    // Query 3: Successful bookings and sales
    const bookingSummary = await db.booking.aggregate({
      where: {
        userId: userId,
      },
      _count: {
        _all: true,
      },
      _sum: {
        totalPrice: true,
      },
    });

    const groupedResults = await db.booking.groupBy({
      by: ['propertyId'],
      where: {
        userId: 'abc',
      },
      _count: {
        _all: true,
      },
      _sum: {
        totalPrice: true,
      },
      orderBy: {
        propertyId: 'asc',
      },
    });

    // Then, fetch the related listing data
    const propertyIds = groupedResults.map(result => result.propertyId);

    const listings = await db.listing.findMany({
      where: {
        listing_id: { in: propertyIds },
      },
      select: {
        listing_id: true,
        title: true,
      },
    });

    // Combine the results
    const salesPerListins = groupedResults.map(result => {
      const listing = listings.find(listing => listing.listing_id === result.propertyId);
      return {
        id: result.propertyId,
        title: listing?.title ?? 'Unknown Title',
        bookings: result._count._all,
        sales: result._sum.totalPrice,
      };
    });


    // Combine results into one JSON object
    const result = {
      bookingStats: formattedBookingStats,
      salesPerListins: salesPerListins,
      totalListings: totalListings,
      successfulBookings: bookingSummary._count._all,
      sales: bookingSummary._sum.totalPrice,
    };

    return result;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to fetch analytics');
  }
};


export const getRecentRecords = async (userId: string) => {
  try {
    // Define the SQL queries

    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }
    const bookings: any[] = await db.$queryRaw`
    SELECT 
      b.*, 
      l.title AS "villaName", 
      'booking' AS "type" 
    FROM 
      "Booking" b
    LEFT JOIN 
      "Listing" l 
    ON 
      b."propertyId" = l."listing_id"
    WHERE 
      b."ownerId" = ${userId} and( b."status" = 'Confirmed' or b."status" = 'Cancelled')
    ORDER BY 
      b."createdAt" DESC
    LIMIT 10
  `;


    const villaReviews: any[] =
      await db.$queryRaw`
  SELECT 
    vr.*, 
    l.title AS "villaName", 
    'villaReview' AS "type" 
  FROM 
  "villaReviews"   vr
  LEFT JOIN 
    "Listing" l 
  ON 
    vr."villaId" = l."listing_id"
  WHERE 
    l."host_id" = ${userId}
  ORDER BY 
    vr."updatedAt" DESC
  LIMIT 10
`;


    // const bookings: any[] = await db.$queryRaw(bookingsQuery, userID);
    // const villaReviews: any[] = await db.$queryRaw(villaReviewsQuery, userID);

    // Combine results and sort by createdAt
    const combinedRecords: any = [...bookings, ...villaReviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Return the combined result
    return { success: true, data: combinedRecords };
  } catch (error) {
    console.error('Error fetching recent records with names:', error);
    return { success: false, error: 'Internal Server Error' };
  }
};


