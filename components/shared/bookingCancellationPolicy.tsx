import React from 'react';


interface BookingCancellationPolicyProps {
    setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cancellationType: string;
}

const BookingCancellationPolicy: React.FC<BookingCancellationPolicyProps> = ({ setIsPopupOpen, cancellationType }) => {
    const numberOfDays = cancellationType ==="FIRM" ? 30 : cancellationType === "FLEXIBLE" ? 15 : 7;


    // FIRM = 30 days, FLEXIBLE = 15 days, Relaxed = 7 days
    return (
        <div className="fixed z-100 inset-0 flex items-center justify-center bg-black bg-opacity-30 z-100 backdrop-blur-sm">
            <div className="bg-white w-[90vw] md:w-[70vw] lg:w-[50vw] h-[90vh] md:h-[80vh] flex justify-center py-10 rounded-xl sm:rounded-3xl shadow-2xl relative transform transition-all duration-300 ease-in-out hover:scale-101">
                {/* Close Button */}
                <button
                    className="absolute top-4 right-4 text-gray-500 text-3xl font-bold hover:text-gray-700 transition-colors duration-200"
                    onClick={() => setIsPopupOpen(false)}
                >
                    &times;
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-scroll custom-scroll w-full">
                    <div className="p-6 md:p-10 pt-6">
                        <div className="w-full text-[1rem] sm:text-lg">
                            <div className="max-w-2xl mx-auto font-sans">
                                {/* Title */}
                                <h2 className="text-3xl font-bold mb-6 text-gray-800">Booking & Cancellation Policy</h2>
                                <hr className="border-gray-200 mb-8" />

                                {/* Cancellation Policy */}
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Cancellation Policy</h3>
                                    <div className="flex items-center justify-between p-4 mt-3 relative w-full bg-gray-50 rounded-lg shadow-sm">
                                        {/* First Step */}
                                        <div className="flex flex-col items-center z-10">
                                            <span className="text-3xl bg-green-100 p-4 rounded-full hover:bg-green-200 transition-colors duration-200">📅</span>
                                            <p className="font-semibold mt-3 text-gray-700">100% Refund</p>
                                            <p className="text-sm text-gray-500 mt-1">Before {numberOfDays} days</p>
                                        </div>

                                        {/* Horizontal Line */}
                                        <div className="flex-grow h-0.5 bg-gray-300 mx-4"></div>

                                        {/* Second Step */}
                                        <div className="flex flex-col items-center z-10">
                                            <span className="text-3xl bg-red-100 p-4 rounded-full hover:bg-red-200 transition-colors duration-200">🏠</span>
                                            <p className="font-semibold mt-3 text-gray-700">No Refund</p>
                                            <p className="text-sm text-gray-500 mt-1">Less than {numberOfDays} days</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Booking Policy */}
                                <div>
                                    <h3 className="text-xl font-semibold mb-6 text-gray-700">Booking Policy</h3>
                                    <ul className="list-disc text-base pl-5 space-y-3 text-gray-600">
                                        <li className="hover:text-gray-800 transition-colors duration-200">Full payment is required to confirm your booking.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">The number of guests must not exceed the count specified at the time of booking.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Only registered guests are permitted to stay at the villa.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Guests must provide valid ID proof upon request, both during booking and upon arrival.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Foreign nationals must submit their passport and visa details prior to check-in.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Any property damage caused by guests will be charged based on actual repair or replacement costs.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Illegal activities, including but not limited to drug use and prostitution, are strictly prohibited.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Commercial activities of any kind are not allowed.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">A refundable deposit will be collected at check-in and returned at check-out, provided there are no damages or missing items.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">Refunds are processed within 5 working days, provided the guest count remains within the allowed limit.</li>
                                        <li className="hover:text-gray-800 transition-colors duration-200">For any delays or concerns, guests can contact <a href="mailto:guestsupport@bnbindia.co.in" className="text-blue-600 underline hover:text-blue-700">guestsupport@bnbindia.co.in</a> for assistance.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCancellationPolicy;