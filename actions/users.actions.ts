"use server"
import { db } from "@/lib/db";
import { decrypt } from "@/utils/Encryption";
import { cookies } from "next/headers";
import { Message } from "rsuite";


export const checkUserValid = async (uid: string) => {
  try {
    const data = await db.users.findUnique({
      where: {
        user_id: uid,
      }
    });

    if (data) {
      return { success: true, data: data, message: "User data fetched successfully" };
    } else {
      return { success: false, data: null, message: "User not found" };
    }
  } catch (error) {
    return { success: false, data: null, message: "Error fetching user" };
  }


}

export const AddUserData = async ({
  user_id,
  first_name,
  last_name,
  email_id,
  phone_number,
  profile_image,
  isHost
}: {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email_id: string;
  phone_number: string | null;
  profile_image: string | null;
  isHost: boolean;
}) => {
  try {
    const existingUser = await db.users.findUnique({
      where: { user_id },
    });

    if (existingUser) {
      return { success: false, data: existingUser, message: "User already exists" };
    }

    const addUserData = await db.users.create({
      data: {
        user_id,
        first_name: first_name || "",
        last_name: last_name || "",
        email_id,
        phone_number: phone_number || "",
        profile_image: profile_image || "",
        created_time: new Date(),
        updated_time: new Date(),
        isHost: false,
      },
    });

    return { success: true, data: addUserData, message: "User added" };
  } catch (error) {
    return { success: false, error: "Failed to create user" };
  }
};



export const fetchUser = async (uid?: string) => {
  let user_id: string = uid ? uid : "";

  if (!uid) {
    const encrypted_host_id = cookies().get('encrypted-uid');
    if (!encrypted_host_id) {
      return { success: false, error: "User not authenticated" };
    }

    const userId: string = await decrypt(encrypted_host_id.value);
    user_id = userId;
  }

  try {
    const data = await db.users.findUnique({
      where: {
        user_id: user_id,
      }
    });

    if (data) {
      return { success: true, data: data, message: "User data fetched successfully" };
    } else {
      return { success: false, data: null, message: "User not found" };
    }
  } catch (error) {
    return { success: false, data: null, message: "Error fetching user" };
  }
}



export const addBankDetails = async (bankData: {
  accountType: string;
  accountNumber: string;
  ifscCode: string;
  pan: string;
  accountHolderName: string;
  gstNumber: string;
}) => {
  let user_id: string | null = null;

  // Get encrypted user ID from cookies
  const encrypted_host_id = cookies().get('encrypted-uid');
  if (encrypted_host_id) {
    user_id = await decrypt(encrypted_host_id.value);
  }

  if (!user_id) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    const userExists = await db.users.findUnique({ where: { user_id } });
    if (!userExists) {
      return { success: false, message: "User does not exist" };
    }
    const data = {
      user_id: user_id,
      bank_account_number: bankData.accountNumber,
      ifsc_code: bankData.ifscCode,
      pan_number: bankData.pan,
      account_holder_name: bankData.accountHolderName,
      account_type: bankData.accountType,
      gst_number: bankData.gstNumber
    }
    const bankDetails = await db.hostpanel.upsert({
      where: { user_id },
      update: { ...data },
      create: { ...data }
    });

    return { success: true, data: bankDetails, message: "Bank details added successfully" };
  } catch (error) {
    return { success: false, message: "Error saving bank details" };
  }
};

export const isBankDetailsAvailable = async () => {
  let user_id: string | null = null;

  // Get encrypted user ID from cookies
  const encrypted_host_id = cookies().get('encrypted-uid');
  if (encrypted_host_id) {
    user_id = await decrypt(encrypted_host_id.value);
  }

  if (!user_id) {
    return { success: false, message: "User not authenticated" };
  }

  try {
    const bankDetails = await db.hostpanel.findUnique({
      where: { user_id }
    });

    if (!bankDetails) {
      return { success: false, message: "Bank details not found" };
    }

    return { success: true, data: bankDetails, message: "Bank details found" };
  } catch (error) {
    return { success: false, message: "Error fetching bank details" };
  }
}


export const UpdateUserData = async (
  firstName: string | null,
  lastName: string | null,
  emailId: string | null,
  phoneNumber: string | null,
  profile_image: string | null,
  dob: Date | null,
  gender: string | null,
  description: string | null,
  language: string[] | null,
  address: string | null,
  city: string | null,
  area_name: string | null,
  state: string | null,
  zipCode: string | null
) => {
  try {
    const encrypted_host_id = cookies().get('encrypted-uid');
    if (!encrypted_host_id) {
      return { success: false, error: "User not authenticated" };
    }

    const userId = await decrypt(encrypted_host_id.value);
    if (!userId) {
      return { success: false, error: "Failed to decrypt user ID" };
    }

    const updateUserData = await db.users.update({
      where: { user_id: userId },
      data: {
        ...(firstName !== null && { first_name: firstName }),
        ...(lastName !== null && { last_name: lastName }),
        ...(emailId !== null && { email_id: emailId }),
        ...(phoneNumber !== null && { phone_number: phoneNumber }),
        ...(profile_image !== null && { profile_image: profile_image }),
        ...(dob !== null && { dob: dob }),
        ...(gender !== null && { gender: gender }),
        ...(description !== null && { description: description }),
        ...(language !== null && { language: language }),
        ...(address !== null && { address: address }),
        ...(city !== null && { city: city }),
        ...(area_name !== null && { area_name: area_name }),
        ...(state !== null && { state: state }),
        ...(zipCode !== null && { zipCode: zipCode }),
        updated_time: new Date(),
      },
    });

    if (!updateUserData) {
      return { success: false, error: "Failed to update user data" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user data:", error);
    return { success: false, error: "Failed to update user data" };
  }
};



export const requestForHost = async (phone_number: string, firstName: string, lastName: string) => {
  try {
    const encrypted_host_id = cookies().get('encrypted-uid');
    if (!encrypted_host_id) {
      // console.error("No encrypted-uid cookie found at fetch request");
      return { error: "User not authenticated" };
    }

    const userId = await decrypt(encrypted_host_id.value);

    const updatedData = await db.users.update({
      where: {
        user_id: userId,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phone_number,
        isHost: true,
      },
    });
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const cookieOptions = { expires, httpOnly: true };
    cookies().set("isHost", "yes", cookieOptions);
    return { success: true, data: updatedData, Message: "Updated data successfully" };
  } catch (error) {
    // console.error("Failed to File a request:", error);
    return { success: false, data: null, Message: "Failed to File a request" };
  }
};


