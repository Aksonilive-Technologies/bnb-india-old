import * as z from "zod";

const requiredString = z.string().min(1, "Required");
const requiredNumber = z.number().min(1, "Required");
const imagesSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Must be an image file",
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, "File must be less than 2MB");

export const AmenetiesSchema = z.object({
  amenity_name: requiredString,
});

export const createListingSchema = z.object({

  villaType: requiredString,

  address: requiredString,
  city: requiredString,
  area_name: requiredString,
  state: requiredString,
  zipCode: requiredNumber,

  numberOfBedrooms: requiredNumber,
  numberOfBathrooms: requiredNumber,
  numberOfBeds: requiredNumber,

  latitude: requiredString,
  longitude: requiredString,
  // pricePerDay: requiredNumber,
  // images: z.array(imagesSchema).optional(),

  // bookingType: requiredString,
  // minimumStayDays: requiredNumber,
  // weekendMinimumStayDays: requiredNumber,
  // specialMinimumDays: requiredNumber,
  // title: requiredString,
  // description: requiredString,
  // isListed: z.boolean({
  //   required_error: "Required",
  // }),

  // maxGuests: requiredNumber,
  // minGuests: requiredNumber,
  // pricePerGuest: requiredNumber,

  // family_only: z.boolean(),
  // bnbVerified: z.boolean(),

  // amenity_name: z.array(z.string()),

  // createdAt: z.date(),
  // updatedAt: z.string(),
});
export const firstUpdateSchema = z.object({


  // pricePerDay: requiredNumber,
  
  // bookingType: requiredString,
  // minimumStayDays: requiredNumber,
  // weekendMinimumStayDays: requiredNumber,
  // specialMinimumDays: requiredNumber,
  title: requiredString,
  description: requiredString,
  images: z.array(imagesSchema).optional(),
  // isListed: z.boolean({
  //   required_error: "Required",
  // }),

  // maxGuests: requiredNumber,
  // minGuests: requiredNumber,
  // pricePerGuest: requiredNumber,

  // family_only: z.boolean(),
  // bnbVerified: z.boolean(),

  // amenity_name: z.array(z.string()),

  // createdAt: z.date(),
  // updatedAt: z.string(),
});

export type createListingType = z.infer<typeof createListingSchema>;

export type firstUpdateSchema = z.infer<typeof firstUpdateSchema>;