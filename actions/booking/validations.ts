import * as z from "zod";

const requiredString = z.string().min(1, "Required");
const requiredNumber = z.number().min(1, "Required");
// const requiredDate = z.date



export const createBookingSchema = z.object({
    userId: z.string(),
    propertyId: z.string(),
    checkinDate: z.date(),
    checkoutDate: z.date(),
    adults: z.number(), 
    children: z.number(), 
    pets : z.number(), 
    totalPrice: z.number(),
    status: z.string(),
  });
  export type createBookingType = z.infer<typeof createBookingSchema>;