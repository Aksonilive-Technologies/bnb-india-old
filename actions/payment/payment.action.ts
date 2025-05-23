"use server"
import { db } from "@/lib/db";

const CUSTOM_SERVER_URL = process.env.NEXT_PUBLIC_CUSTOM_WEBHOOK_SERVER_URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


async function checkBookingDatesAvailable(
    checkinD: Date,
    checkoutD: Date,
    propertyId: string
): Promise<boolean> {
    try {
        const blockedDates = await db.hotelPriceData.findMany({
            where: {
                villa_id: propertyId,
                date: {
                    gte: checkinD,
                    lt: checkoutD
                },
                blockNight: true
            }
        });

        return blockedDates.length === 0;
    } catch (error) {
        console.error("Error checking booking availability:", error);
        return false;
    }
}

export const createBookingAndSavePayment = async ({
    booking_id,
    userId,
    propertyId,
    ownerId,
    checkinDate,
    checkoutDate,
    totalPrice,
    payment_id,
    order_id,
    signature,
    pricePerDay
}: {
    booking_id: string;
    userId: string;
    propertyId: string;
    ownerId: string;
    checkinDate: string;
    checkoutDate: string;
    totalPrice: number;
    payment_id: string;
    order_id: string;
    signature: string;
    pricePerDay: number;
}) => {
    // Your function logic here

    try {
        // Convert date strings to Date objects
        console.log("Booking Data:", {
            booking_id, user_id: userId, property_id: propertyId, owner_id: ownerId, checkinDate, checkoutDate, totalPrice, payment_id, order_id, signature, pricePerDay
        }
        );

        const checkinD = new Date(checkinDate);
        const checkoutD = new Date(checkoutDate);

        // Step 1: Save transaction
        const transaction = await db.transactionDetails.create({
            data: {
                booking_id,
                payment_id,
                order_id,
                signature,
                payment_amount: totalPrice,
                payment_status: "confirmed"
            }
        });

        console.log("Transaction saved successfully!", transaction);

        // Step 2: Check availability
        const isAvailable = await checkBookingDatesAvailable(checkinD, checkoutD, propertyId);

        if (!isAvailable) {
            console.log("Dates are not available for booking. Initiating refund process.");

            // Update booking with transaction ID
            const booking = await db.booking.update({
                where: { id: booking_id },
                data: { transactionID: payment_id }
            });

            // Update transaction using `payment_id` (correct primary key)
            await db.transactionDetails.update({
                where: { payment_id }, // Fixed here
                data: { payment_status: "refundProcessing" }
            });

            return { success: false, booking, transaction };
        }

        // Step 3: Process booking transactionally
        const result = await db.$transaction(async (tx) => {
            // Confirm the booking
            const booking = await tx.booking.update({
                where: { id: booking_id },
                data: {
                    transactionID: payment_id,
                    status: "confirmed",
                },
            });

            // Block nights for the property
            let currentDate = new Date(checkinD);
            while (currentDate < checkoutD) {
                await tx.hotelPriceData.upsert({
                    where: {
                        villa_id_date: { villa_id: propertyId, date: currentDate }
                    },
                    update: { blockNight: true },
                    create: {
                        villa_id: propertyId,
                        date: currentDate,
                        pricingDetails: {
                            price: pricePerDay,
                            discount: 0,
                            minBookingDays: 1
                        },
                        blockNight: true,
                    },
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return booking;
        });

        // Step 4: Send Notification to Owner
        const d: any = await sendBookingNotification(booking_id, ownerId);

        console.log("Booking successfully confirmed!", result, d);
        return { success: true, result };
        // return result;
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, error: error };
    }
};


function calculateRefundAmount(
    cancellationType: "FLEXIBLE" | "RELAXED" | "FIRM",
    checkinDate: Date,
    totalAmount: number,
    serverTime: Date // Accept server time instead of fetching it inside
  ): number {
    const cancellationTime = serverTime.getTime();
    const checkinTime = checkinDate.getTime();
    const timeDiff = checkinTime - cancellationTime;
    const daysBeforeCheckin = timeDiff / (1000 * 60 * 60 * 24); // Convert milliseconds to days

  
    let refundPercentage = 0;
  
    if (cancellationType === "FLEXIBLE" && daysBeforeCheckin >= 1) {
      refundPercentage = 1.0; // 100% refund
    } else if (cancellationType === "RELAXED" && daysBeforeCheckin >= 3) {
      refundPercentage = 0.5; // 50% refund
    } else if (cancellationType === "FIRM" && daysBeforeCheckin >= 7) {
      refundPercentage = 0; // No refund
    }
  
    // Calculate refund before deducting processing fee
    let refundAmount = totalAmount * refundPercentage;
  
    // Deduct 5% processing fee
    refundAmount -= refundAmount * 0.05;
  
    return refundAmount;
  }
  




export const cancelBooking = async (
    bookingId: string,
    transactionID: string,
    amount: string,
    refund: boolean = false,
    reason: string = "booking cancellation"
) => {
    let refund_status = "failed";
    let updatedBooking = null;
    let success = false;
    let error = null;

    

    try {
        updatedBooking = await db.$transaction(async (tx) => {
            // Step 1: Cancel the booking in progress
            const booking = await tx.booking.update({
                where: { id: bookingId },
                data: { status: "cancellationInProgress" },
            });

            const serverTimeResult = await db.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now;`;


            const listing = await tx.listing.findUnique({
            where: {
                listing_id: booking.propertyId,
            },
            select: {
                cancellationType: true,
            },
            });

            const validCancellationTypes = ["FIRM", "FLEXIBLE", "RELAXED"] as const;
            const cancellationType = validCancellationTypes.includes(listing?.cancellationType as any)
            ? (listing?.cancellationType as "FIRM" | "FLEXIBLE" | "RELAXED")
            : "FIRM"; // Default to "FIRM" if invalid

            if (!serverTimeResult || serverTimeResult.length === 0) {
                throw new Error("Failed to fetch server time.");
            }
            
            const serverTime = serverTimeResult[0].now; // Get current time from DB

            
            const refundAmount = calculateRefundAmount(
                cancellationType, 
                new Date(booking.checkinDate), 
                Number(amount),
                serverTime // Pass the server time
            );
              


            console.log("Booking cancelled:", booking);

            // Step 2: Update transaction status
            await tx.transactionDetails.update({
                where: { payment_id: booking.transactionID },
                data: { payment_status: refund ? "refundProcessing" : "noRefund" },
            });

            // Step 3: Refund amount if applicable
            if (refund) {
                try {
                    const refundResponse = await fetch(`${BASE_URL}/api/razorpay/refund`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            payment_id: transactionID,
                            amount: Number(refundAmount) * 100, // Convert to paise
                            speed: "optimum",
                            reason,
                        }),
                    });

                    const refundData = await refundResponse.json();
                    if (refundResponse.ok && refundData?.status === "processed") {
                        refund_status = "success";
                        console.log("Refund request successful");
                    } else {
                        error = refundData.error || "Refund request failed.";
                    }
                } catch (err) {
                    error = `Refund API error: ${err}`;
                }

                // Update refund status in DB
                await tx.transactionDetails.update({
                    where: { payment_id: booking.transactionID },
                    data: { payment_status: refund_status === "success" ? "refundProcessed" : "refundFailed" },
                });
            }

            // Step 4: Unblock previously booked nights
            let currentDate = new Date(booking.checkinDate);
            const endDate = new Date(booking.checkoutDate);
            while (currentDate < endDate) {
                await tx.hotelPriceData.update({
                    where: { villa_id_date: { villa_id: booking.propertyId, date: currentDate } },
                    data: { blockNight: false },
                });
                currentDate.setDate(currentDate.getDate() + 1);
            }

            // Step 5: Cancel the booking
            await tx.booking.update({
                where: { id: bookingId },
                data: { status: "cancelled" },
            });

            return booking;
        });

        // Step 5: Send cancellation notification
        await sendCancellationNotification(bookingId, updatedBooking.ownerId);
        success = true;
    } catch (err: any) {
        error = `Booking cancellation failed: ${err.message || err}`;
    } finally {
        return {
            "success": success,
            "refund_status": refund_status,
            "result": updatedBooking,
            "error": error,
        };
    }
};



const sendBookingNotification = async (booking_id: string, ownerId: string) => {
    try {
        const response = await fetch(`${CUSTOM_SERVER_URL}/createBookingNotification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ booking_id, ownerId }),
        });

        const data = await response.json();
        console.log("Notification response:", data);
        return data;
    } catch (error) {
        console.error("Error sending booking notification:", error);
    }
};



const sendCancellationNotification = async (booking_id: string, ownerId: string) => {
    console.log(booking_id, ownerId, " at notif for cancel");

    try {
        const response = await fetch(`${CUSTOM_SERVER_URL}/cancel-booking-notification/${booking_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ownerId }),
        });

        const data = await response.json();
        console.log("Cancellation notification response:", data);
        return data;
    } catch (error) {
        console.error("Error sending cancellation notification:", error);
    }
};