import { UpdateUserData } from "@/actions/users.actions";
import { useUserStore } from "@/store/store";
import { useState } from "react";
import toast from "react-hot-toast";

export default function PhoneNumberPopup({ setPhonePopup }: { setPhonePopup: (value: boolean) => void }) {
    const [open, setOpen] = useState(true);
    const { user, setUser } = useUserStore();
    const [phoneNumber, setPhoneNumber] = useState(user?.phone_number);
    const [error, setError] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
        setPhoneNumber(value);
        setError(value.length === 10 ? "" : "Enter a valid 10-digit number");
    };

    const handleSubmit = async () => {
        if (phoneNumber.length === 10) {
            try {
                const { success, error } = await UpdateUserData(null, null, null, phoneNumber, null, null, null, null, null, null, null, null, null, null);

                if (success) {
                    setUser({
                        ...user,
                        phone_number: phoneNumber
                    });
                    toast.success("Phone number updated successfully");
                    setOpen(false);
                    setPhonePopup(false);
                } else {
                    toast.error(`Failed to update phone number: ${error}`);
                }
            } catch (error) {
                console.error("Error updating phone number:", error);
                toast.error("An error occurred while updating phone number.");
            }
        } else {
            setError("Enter a valid 10-digit number");
        }
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white p-8 rounded-3xl shadow-2xl w-96 transform scale-95 animate-scaleUp">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Update Contact Details</h3>

                        {/* Email (Non-editable) */}
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={user?.email_id || "N/A"}
                                disabled
                                className="w-full p-3 border border-gray-300 bg-gray-100 rounded-xl text-lg cursor-not-allowed"
                            />
                        </div>

                        {/* Phone Number (Editable) */}
                        <div className="mb-6">
                            <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength={10}
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="Enter your 10-digit number"
                                    className="w-full p-3 pl-12 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                />
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">+91</span>
                            </div>
                            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                className="w-1/2 px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-300 transition"
                                onClick={() => { setOpen(false); setPhonePopup(false); }}
                            >
                                Cancel
                            </button>
                            <button
                                className={`w-1/2 px-4 py-2 text-white font-medium rounded-xl transition ${phoneNumber.length === 10
                                        ? "bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                onClick={handleSubmit}
                                disabled={phoneNumber.length !== 10}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}