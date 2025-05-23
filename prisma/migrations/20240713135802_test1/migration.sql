-- CreateTable
CREATE TABLE "Amenities" (
    "amenity_id" TEXT NOT NULL,
    "amenity_name" TEXT NOT NULL,
    "amenity_image" TEXT NOT NULL,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("amenity_id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "listing_id" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "area_name" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "zipCode" INTEGER NOT NULL,
    "numberOfBedrooms" INTEGER NOT NULL,
    "numberOfBathrooms" INTEGER NOT NULL,
    "numberOfBeds" INTEGER NOT NULL,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isListed" BOOLEAN NOT NULL,
    "maxGuests" INTEGER NOT NULL,
    "minGuests" INTEGER NOT NULL DEFAULT 1,
    "pricePerGuest" INTEGER NOT NULL DEFAULT 1000,
    "bookingType" TEXT NOT NULL,
    "family_only" BOOLEAN NOT NULL,
    "bnbVerified" BOOLEAN NOT NULL,
    "ac" BOOLEAN NOT NULL DEFAULT false,
    "chef" BOOLEAN NOT NULL DEFAULT false,
    "garden" BOOLEAN NOT NULL DEFAULT false,
    "heater" BOOLEAN NOT NULL DEFAULT false,
    "kitchen" BOOLEAN NOT NULL DEFAULT false,
    "parking" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "snooker" BOOLEAN NOT NULL DEFAULT false,
    "staff" BOOLEAN NOT NULL DEFAULT false,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("listing_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkinDate" TIMESTAMP(3) NOT NULL,
    "checkoutDate" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL,
    "pets" INTEGER NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VillaImages" (
    "villaImage_uid" SERIAL NOT NULL,
    "villa_id" TEXT NOT NULL,
    "image_url" TEXT,
    "type" TEXT NOT NULL,
    "topImage" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VillaImages_pkey" PRIMARY KEY ("villaImage_uid")
);

-- CreateTable
CREATE TABLE "HotelPriceData" (
    "id" SERIAL NOT NULL,
    "villa_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pricingDetails" JSONB NOT NULL,
    "blockNight" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "HotelPriceData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tredingVillas" (
    "tredingVillas_id" SERIAL NOT NULL,
    "villa_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tredingVillas_pkey" PRIMARY KEY ("tredingVillas_id")
);

-- CreateTable
CREATE TABLE "luxuryVillas" (
    "luxuryVillas_id" SERIAL NOT NULL,
    "villa_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "luxuryVillas_pkey" PRIMARY KEY ("luxuryVillas_id")
);

-- CreateTable
CREATE TABLE "userWishlist" (
    "userWishlist_id" SERIAL NOT NULL,
    "villa_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userWishlist_pkey" PRIMARY KEY ("userWishlist_id")
);

-- CreateTable
CREATE TABLE "userReviews" (
    "userreviews_id" SERIAL NOT NULL,
    "villaId" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "star_1" INTEGER NOT NULL,
    "star_2" INTEGER NOT NULL,
    "star_3" INTEGER NOT NULL,
    "review_1" TEXT NOT NULL,
    "review_2" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "userReviews_pkey" PRIMARY KEY ("userreviews_id")
);

-- CreateTable
CREATE TABLE "hostReviews" (
    "hostreviews_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "host_id" TEXT NOT NULL,
    "star_1" INTEGER NOT NULL,
    "star_2" INTEGER NOT NULL,
    "star_3" INTEGER NOT NULL,
    "review_1" TEXT NOT NULL,
    "review_2" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hostReviews_pkey" PRIMARY KEY ("hostreviews_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HotelPriceData_villa_id_date_key" ON "HotelPriceData"("villa_id", "date");

-- AddForeignKey
ALTER TABLE "VillaImages" ADD CONSTRAINT "VillaImages_villa_id_fkey" FOREIGN KEY ("villa_id") REFERENCES "Listing"("listing_id") ON DELETE RESTRICT ON UPDATE CASCADE;
