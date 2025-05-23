import * as z from "zod";

// Define the PricingDetails schema
const PricingDetailsSchema = z.object({
    price: z.number(),
    discount: z.number(),
    minBookingDays: z.number(),
});

// Define the HotelPriceData schema
export const createHotelPriceDataSchema = z.object({
    villa_id: z.string(),
    date: z.date(),
    blockNight: z.boolean(),
    pricingDetails: PricingDetailsSchema,
});

export type createHotelPriceDataSchema = z.infer<typeof createHotelPriceDataSchema>