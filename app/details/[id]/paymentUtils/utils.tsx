
import { format } from 'date-fns';
import { CalculatePrice, checkBookingDatesAvailable, initializeBooking } from '@/actions/booking/booking.action';
import toast from 'react-hot-toast';
import { checkUserValid } from '@/actions/users.actions';
import { createBookingAndSavePayment } from '@/actions/payment/payment.action';



// Utility functions

// first part
export const initializePayment = async (
    user: any,
    villaData: any,
    id: string,
    bookingDetails: any,
    isAgreed: boolean,
    price: number,
    extraGuestPrice: number,
    serviceFee: number,
    setIsProcessing: (processing: boolean) => void,
    setPhonePopup: (popup: boolean) => void,
    router: any
): Promise<void> => {

    setIsProcessing(true);
    if (!isAgreed) {
        toast.error("Please review and agree to the terms and conditions before proceeding.");
        setIsProcessing(false);
        return;
    }
    if(villaData?.isListed === false){
        toast.error("This property is not listed anymore. Please try another property.");
        setIsProcessing(false);
        return;
    }

    if (!user) {
        toast.error("Please Login first");
        router.push(`/login?redirect=/details/${id}/bookingconfirmation`);
        return;
    } else {
        const isUserValid = await checkUserValid(user?.user_id);
        if (!isUserValid) {
            toast.error("User not valid, please login again");
            router.push(`/login?redirect=/details/${id}/bookingconfirmation`);
            return;
        }
    }

    if (!user.phone_number) {
        toast.error("Your phone number is required to proceed. Please verify it in your profile settings.");
        setPhonePopup(true);
        setIsProcessing(false);
        return;
    }

    if (bookingDetails?.checkinDate >= bookingDetails?.checkoutDate) {
        toast.error("Invalid date selection. The check-in date must be before the check-out date.");
        setIsProcessing(false);
        return;
    }

    const loadingToast = toast.loading("Checking availability...");
    const isAvailable = await checkBookingDatesAvailable(
        bookingDetails.checkinDate,
        bookingDetails.checkoutDate,
        id
    );
    toast.success("Available");
    if (!isAvailable) {
        toast.error("The selected booking dates are unavailable. Please choose a different date range.");
        setIsProcessing(false);
        return;
    }
    toast.dismiss(loadingToast);

    try {
        const amount = price + extraGuestPrice + serviceFee;
        const bookingData = {
            userId: user.user_id,
            propertyId: id,
            ownerId: villaData.host_id,
            checkinDate: bookingDetails?.checkinDate,
            transactionID: "",
            checkoutDate: bookingDetails?.checkoutDate,
            adults: bookingDetails?.adults,
            children: bookingDetails?.children,
            pets: bookingDetails?.pets,
            totalPrice: amount,
            serviceFee: serviceFee,
        };

        const initialisedBooking = await initializeBooking(bookingData);
        if (!initialisedBooking?.success) {
            toast.error(initialisedBooking.error || "Failed to initialize payment. Please try again.");
            setIsProcessing(false);
            return;
        }

        const order = await createOrder(amount);
        if (order) {
            await processPayment(amount, order, initialisedBooking.booking, user, bookingDetails, villaData);
        } else {
            toast.error("Failed to create order. Please try again.");
            setIsProcessing(false);
        }
    } catch (error) {
        console.error("Payment initialization failed:", error);
        toast.error("Payment initialization failed. Please try again.");
        setIsProcessing(false);
    }
};

// second phase 
export const createOrder = async (amount: any): Promise<any> => {
    const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: parseFloat(amount) * 100,
        }),
    });

    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    return data;
};
// third phase
export const processPayment = async (
    amount: any,
    order: any,
    bookingData: any,
    user: any,
    bookingDetails: any,
    villaData: any
): Promise<void> => {
    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount) * 100,
        currency: 'INR',
        name: 'Bnb India',
        order_id: order.orderId,
        description: `Villa ID ${bookingData.propertyId},
         Dates: ${format(
            new Date(bookingDetails.checkinDate),
            'dd/MM/yy'
        )} - ${format(new Date(bookingDetails.checkoutDate), 'dd/MM/yy')}, User ID: ${user.user_id
            }, Booking ID: ${bookingData.id}`,
        notes: ['through bnbIndia - web'],
        handler: async (response: any) => {
            console.log('Payment successful:', response);
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;
            const Data = {
                propertyId: bookingData.propertyId,
                booking_id: bookingData.id,
                checkinDate: bookingDetails?.checkinDate,
                totalPrice: amount,
                PricePerDay: villaData.pricePerDay,
                checkoutDate: bookingDetails?.checkoutDate,
                order_id: orderId,
                signature: signature,
                payment_id: paymentId,
                ownerId: bookingData.ownerId,
                userId: bookingData.user_id,
            };

            await saveBookingAndPayment(Data);
        },
        prefill: {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            contact: user.phone_number,
        },
        theme: {
            color: '#3399cc',
        },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.on('payment.failed', (response: any) => {
        console.error('Payment failed', response.error);
        toast.error('Payment Unsuccessful! Please try again.');
    });
    rzp1.open();
};

// fourth phase
export const saveBookingAndPayment = async (bookingData: any): Promise<void> => {
    try {
        const bookingResponse = await createBookingAndSavePayment(bookingData);
        if (bookingResponse.success) {
            console.log('Booking successful:', bookingResponse.result);

            toast.success('Booking successful');
            toast.success('Redirecting to your bookings...');
            setTimeout(() => {
                window.location.href = `/profile/mybookings/${bookingResponse?.result?.id}/viewAndManage`;
            }, 1500);
           } else {
            toast.error('Failed to create booking');
            throw new Error(`Failed to create booking, server responded with status: ${bookingResponse.error}`);
        }
    } catch (error) {
        console.error('Booking creation failed:', error);
    }
};

export const fetchPrice = async (
    bookingDetails: any,
    listingData: any,
    // setPrice: (price: number) => void,
    // setExtraGuestPrice: (price: number) => void,
    // setPriceLoading: (loading: boolean) => void
): Promise<any> => {
    const startDate = bookingDetails?.checkinDate;
    const endDate = bookingDetails?.checkoutDate;
    if (!startDate || !endDate) return;
    if (startDate == endDate) {
        toast.error('Checkin and Checkout date cannot be same');
        return;
    }
    // setPriceLoading(true);

    const daysDifference = calculateDaysDifference(startDate, endDate);
    const calculatedPrice = await CalculatePrice({
        propertyId: bookingDetails?.propertyId,
        checkinDate: bookingDetails?.checkinDate,
        checkoutDate: bookingDetails?.checkoutDate,
        adults: bookingDetails?.adults,
        children: bookingDetails?.children,
        pets: bookingDetails?.pets,
    });

    let roomPrice: any = 0;
    if (calculatedPrice.success) {
        roomPrice = calculatedPrice.totalPrice;
    }
    // setPrice(roomPrice);

    let extraGuest = 0;
    let extraPrice = 0;
    let serviceFee = 0;
    if (bookingDetails?.adults > listingData[0].maxGuests) {
        extraGuest = bookingDetails?.adults - listingData[0]?.maxGuests;
    }
    extraPrice = extraGuest * listingData[0].pricePerGuest * daysDifference;
    serviceFee = (roomPrice + extraPrice) * 0.025;
    // setExtraGuestPrice(extraPrice);
    // setPriceLoading(false);

    return { roomPrice, extraPrice, serviceFee };
};

export const calculateDaysDifference = (checkinDate: Date, checkoutDate: Date): number => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const timeDifference = checkout.getTime() - checkin.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysDifference);
};


export const formatNumberWithCommas = (num: number): string => {
    const options = { maximumFractionDigits: 2 }
    const formattedNumber = Intl.NumberFormat("en-US", options).format(num);
    return formattedNumber;
};