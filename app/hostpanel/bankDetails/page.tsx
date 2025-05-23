'use client';
import { addBankDetails, isBankDetailsAvailable } from '@/actions/users.actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function BankDetailsForm() {
    const [formData, setFormData] = useState({
        accountType: '',
        accountNumber: '',
        confirmAccountNumber: '',
        ifscCode: '',
        pan: '',
        accountHolderName: '',
        gstNumber: ""
    });
    const query = useSearchParams();
    const router = useRouter()
    const getRedirectUrl = (): string => {
        const redirectUrl = query?.get("redirect");
        return redirectUrl || '/';
    };

    const [loading, setLoading] = useState(true);
    const fetchbankDetails = async () => {
        setLoading(true);
        const response: any = await isBankDetailsAvailable();
        if (response.success) {
            console.log("Bank details found");
            setFormData({
                accountType: response.data.account_type,
                accountNumber: response.data.bank_account_number,
                confirmAccountNumber: response.data.bank_account_number,
                ifscCode: response.data.ifsc_code,
                pan: response.data.pan_number,
                accountHolderName: response.data.account_holder_name,
                gstNumber: response.data.gst_number,
            });
        }
        setLoading(false);
    }
    useEffect(() => {
        fetchbankDetails();
    }, []);
    const [errors, setErrors] = useState<any>({});
    const [processing, setProcessing] = useState(false);
    const validateForm = (name: any, value: any) => {
        let newErrors: any = { ...errors };

        if (name === 'accountType') {
            newErrors.accountType = value ? '' : 'Account type is required';
        }

        if (name === 'accountNumber') {

            if (value !== formData.confirmAccountNumber) {
                newErrors.accountNumber = 'Account numbers do not match';
                newErrors.confirmAccountNumber = 'Account numbers do not match';
            } else {
                newErrors.accountNumber = '';
                newErrors.confirmAccountNumber = '';
            }

        }
        if (name === 'confirmAccountNumber') {
            if (value !== formData.accountNumber) {
                newErrors.accountNumber = 'Account numbers do not match';
                newErrors.confirmAccountNumber = 'Account numbers do not match';
            } else {
                newErrors.accountNumber = '';
                newErrors.confirmAccountNumber = '';
            }
        }
        if (name === 'ifscCode') {
            newErrors.ifscCode = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(value) ? '' : 'Invalid IFSC code format';
        }

        if (name === 'pan') {
            newErrors.pan = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ? '' : 'Invalid PAN format';
        }

        if (name === 'accountHolderName') {
            newErrors.accountHolderName = value.length >= 3 ? '' : 'Name must be at least 3 characters';
        }

        if (name === 'gstNumber') {
            // GST number validation (15 characters, first 2 are state code, next 10 are PAN, last 3 are optional)
            if (value) {
                newErrors.gstNumber = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(value)
                    ? ''
                    : 'Invalid GST number format';
            } else {
                // GST number is optional, so clear the error if the field is empty
                newErrors.gstNumber = '';
            }
        }

        setErrors(newErrors);
    };
    const handleChange = (e: any) => {
        const { name, value } = e.target;
        const upperValue = value.toUpperCase();
        setFormData({ ...formData, [name]: upperValue });
        validateForm(name, upperValue);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        // validateForm(name, upperValue);
        const isValid = Object.values(errors).every(error => error === '') && Object.values(formData).every(field => field !== '');
       
        if (isValid && !processing) {
            setProcessing(true);
            toast.loading('Processing...');
            const response: any = await addBankDetails(formData);
            toast.dismiss();
            if (response.success) {
                console.log(response);
                toast.success("Bank details added successfully !!")
                const redirectUrl = getRedirectUrl();
                router.push(redirectUrl);
            }
            else {
                toast.error("Error Occured !!")
            }
            setProcessing(false);
            // alert('Form submitted successfully!');
        }
        else{
            toast.error("Please fill all the fields correctly !!")
        }
    };

    return (
        <div>
            {
                loading ?
                    <div className='text-center flex items-center justify-center h-[40vh] w-full'>
                        <p className='text-center'>
                            Loading ...
                        </p>
                    </div> :
                    <div className="w-full mx-auto h-[75vh] mt-[12vh] flex flex-col items-left md:w-[55vw] justify-center p-4">
                        <h1 className=" text-2xl font-bold">Add Bank Account Info</h1>
                        <p className='text-md mb-4 text-gray-600 font-semibold'>Please provide your bank details accurately to ensure secure and smooth transactions</p>
                        <form onSubmit={handleSubmit} className="form space-y-4 mb-[10vh]">
                            <label className="field flex flex-col rounded p-2 focus-within:border-pink-500">
                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Is this a current or savings account?</span>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            value="CURRENT"
                                            checked={formData.accountType === 'CURRENT'}
                                            onChange={handleChange}
                                            className="form-radio"
                                        />
                                        Current
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="accountType"
                                            value="SAVINGS"
                                            checked={formData.accountType === 'SAVINGS'}
                                            onChange={handleChange}
                                            className="form-radio"
                                        />
                                        Savings
                                    </label>
                                </div>
                                {errors?.accountType && <span className="text-red-500 text-xs">{errors?.accountType}</span>}
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                    <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Account number</span>
                                    <input
                                        className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                        type="text"
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleChange}
                                    />
                                    {errors?.accountNumber && <span className="text-red-500 text-xs">{errors?.accountNumber}</span>}
                                </label>

                                <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                    <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Confirm account number</span>
                                    <input
                                        className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                        type="text"
                                        name="confirmAccountNumber"
                                        value={formData.confirmAccountNumber}
                                        onChange={handleChange}
                                    />
                                    {errors?.confirmAccountNumber && <span className="text-red-500 text-xs">{errors?.confirmAccountNumber}</span>}
                                </label>
                            </div>

                            <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">IFSC Code</span>
                                <input
                                    className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                    type="text"
                                    name="ifscCode"
                                    value={formData.ifscCode}
                                    onChange={handleChange}
                                />
                                {errors?.ifscCode && <span className="text-red-500 text-xs">{errors?.ifscCode}</span>}
                            </label>

                            <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">PAN Number</span>
                                <input
                                    className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                    type="text"
                                    name="pan"
                                    value={formData.pan}
                                    onChange={handleChange}
                                />
                                {errors?.pan && <span className="text-red-500 text-xs">{errors?.pan}</span>}
                            </label>

                            <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">Account Holder Name</span>
                                <input
                                    className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                    type="text"
                                    name="accountHolderName"
                                    value={formData.accountHolderName}
                                    onChange={handleChange}
                                />
                                {errors?.accountHolderName && <span className="text-red-500 text-xs">{errors?.accountHolderName}</span>}
                            </label>

                            {/* Optional GST Number Field */}
                            <label className="field flex flex-col border border-gray-200 rounded p-2 focus-within:border-pink-500">
                                <span className="field__label text-gray-600 text-xs font-semibold uppercase mb-1">GST Number (Optional)</span>
                                <input
                                    className="field__input bg-transparent text-lg font-bold focus:outline-none"
                                    type="text"
                                    name="gstNumber"
                                    value={formData.gstNumber || ''}
                                    onChange={handleChange}
                                />
                                {errors?.gstNumber && <span className="text-red-500 text-xs">{errors?.gstNumber}</span>}
                            </label>

                            <button type="submit" className="w-full red-gradient text-white p-3 rounded-lg transition mt-4">
                                {processing ? 'Processing...' : 'Submit'}
                            </button>
                        </form>
                    </div>
            }

        </div>

    );
}