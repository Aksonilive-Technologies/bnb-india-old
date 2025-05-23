"use server"
import { db } from "@/lib/db";
// import { Prisma } from '@prisma/client';
import { createHotelPriceDataSchema } from "./validation";


export async function getHotelData(villa_id: string) {
    try {
        const hotelData = await db.hotelPriceData.findMany({
            where: {
                villa_id: villa_id,
            },
        });
        // console.log(hotelData);

        return hotelData.length ? hotelData : [];
    } catch (err) {
        console.error('Error fetching hotel data:', err);
        return [];
    }
}
export async function getAllvilla() {
    try {
        const VillaData = await db.listing.findMany();
        // console.log(VillaData);

        return VillaData.length ? VillaData : [];
    } catch (err) {
        console.error('Error fetching hotel data:', err);
        return [];
    }
}


// -------------- add price Data -------------------

interface PricingDetails {
    price: number;
    discount: number;
    minBookingDays: number;
}




export async function addHotelData(data: createHotelPriceDataSchema) {
    // Validate the input data using Zod schema
    const validatedFields = createHotelPriceDataSchema.safeParse(data);

    if (!validatedFields.success) {
        return { error: "Invalid fields", details: validatedFields.error.errors };
    }

    const { villa_id, date, pricingDetails, blockNight } = validatedFields.data;

    try {
        // Ensure the date is correctly formatted for Prisma
        const formattedDate = new Date(date);

        const existingRecord = await db.hotelPriceData.findFirst({
            where: {
                villa_id: villa_id,
                date: formattedDate,
            },
        });

        if (existingRecord) {
            // Update existing record
            const updatedHotelData = await db.hotelPriceData.update({
                where: {
                    id: existingRecord.id,
                },
                data: {
                    pricingDetails: pricingDetails,
                    blockNight,
                },
            });
            return updatedHotelData;
        } else {
            // Create new record
            const newHotelData = await db.hotelPriceData.create({
                data: {
                    villa_id,
                    date: formattedDate,
                    pricingDetails: pricingDetails,
                    blockNight,
                },
            });
            return newHotelData;
        }
    } catch (error) {
        console.error('Error adding/updating hotel price data:', error);
        return { error: "Error adding/updating hotel price data" };
    }
}


