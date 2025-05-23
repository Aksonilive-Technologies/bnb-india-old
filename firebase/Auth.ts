'use server'

import { cookies } from 'next/headers'
import { setPersistence, inMemoryPersistence, getIdToken, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
import admin from "./firebaseAdmin"
import { encrypt } from '@/utils/Encryption';
// import { addUserDataInDB } from '@/utils/addUserDataInDB';
import { AddUserData, fetchUser } from '@/actions/users.actions';
// import { redirect } from 'next/navigation';

type SignUpResponse =
    | { status: 200, data: { 'access-token': string, expires: Date, httpOnly: boolean }, error?: string }
    | { status: number, error: string };


export const loginWithEmailAndPassword = async (email: string, password: string): Promise<SignUpResponse> => {

    try {
        await setPersistence(auth, inMemoryPersistence);

        try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await getIdToken(userCredential.user);

        const uid = userCredential.user.uid;
        const encryptedData = await encrypt(uid);

        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const cookieOptions = { expires, httpOnly: true };

        cookies().set("access-token", idToken, cookieOptions);
        cookies().set("encrypted-uid", encryptedData, cookieOptions);
        const userdata: any = await fetchUser();
        cookies().set("isHost", userdata.data.isHost ? "yes" : "no", cookieOptions);

        return {
            status: 200,
            data: {
                'access-token': idToken,
                expires,
                httpOnly: true
            },
            error: ''
        };

    } catch (error: any) {
        console.error("Login error: ", error);
  
        // Firebase Authentication Error Handling
        let errorMessage = "Failed to log in. Please check your credentials and try again.";
  
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email. Please sign up.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email format. Please enter a valid email.";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled. Please contact support.";
        } else if (error.code === "auth/too-many-requests") {
          errorMessage = "Too many failed login attempts. Please try again later.";
        }
  
        return {
          status: 401,
          error: errorMessage,
        };
      }
    } catch (error) {
      console.error("Persistence error: ", error);
      return {
        status: 400,
        error: "An error occurred while setting persistence. Please try again later.",
      };
    }
};

export const signUpWithEmailAndPassword = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    mobileNumber: string
): Promise<SignUpResponse> => {
    try {
        await setPersistence(auth, inMemoryPersistence);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const idToken = await getIdToken(userCredential.user);
            const uid = userCredential.user.uid;
            const encryptedData = await encrypt(uid);

            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            const cookieOptions = { expires, httpOnly: true };

            cookies().set("access-token", idToken, cookieOptions);
            cookies().set("encrypted-uid", encryptedData, cookieOptions);

            const userData: any = {
                user_id: uid,
                first_name: firstName,
                last_name: lastName,
                email_id: email,
                phone_number: mobileNumber,
                profile_image: '',
                isHost: false,
            };

            // console.log(userData);

            const response = await AddUserData(userData);
            if (!response.success) {
                return {
                    status: 400,
                    error: 'An error occurred while setting persistence. Please try again later.'
                };
            }

            cookies().set("isHost", "no", cookieOptions);
            return {
                status: 200,
                data: {
                    'access-token': idToken,
                    expires,
                    httpOnly: true
                }
            };
        } catch (error) {
            console.error('Signup error: ', error);
            return {
                status: 401,
                error: 'Failed to create user. Please check your details and try again.'
            };
        }
    } catch (error) {
        console.error('Signup error: ', error);
        return {
            status: 400,
            error: 'An error occurred while setting persistence. Please try again later.'
        };
    }
};

export const signUpWithGoogle = async (token: any): Promise<SignUpResponse> => {
    try {
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const cookieOptions = { expires, httpOnly: true };

        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // console.log("decoded token:", decodedToken);

        // Ensure that necessary fields are available
        if (!decodedToken.email || !decodedToken.name) {
            throw new Error('Token does not contain required properties.');
        }

        const fullName = decodedToken.name.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(" ") || '';

        const userDataResponse: any = await AddUserData({
            user_id: uid,
            email_id: decodedToken.email,
            first_name: firstName,
            last_name: lastName,
            phone_number: '',
            profile_image: decodedToken.picture || '',
            isHost: false,
        });


        const response = await AddUserData(userDataResponse);

        // console.log(userDataResponse);

        const encryptedData = await encrypt(uid);
        cookies().set("encrypted-uid", encryptedData, cookieOptions);
        cookies().set("access-token", token, cookieOptions);

        const userdata: any = await fetchUser(uid);
        cookies().set("isHost", userdata?.data?.isHost ? "yes" : "no", cookieOptions);

        return {
            status: 200,
            data: {
                'access-token': token,
                expires,
                httpOnly: true
            }
        };
    } catch (error) {
        console.error('Signup with Google error: ', error);
        return {
            status: 401,
            error: 'Failed to sign up with Google. Please try again.'
        };
    }
};

export const Logout = async () => {
    try {
        // Clear the access token cookie
        cookies().delete('access-token');
        cookies().delete('encrypted-uid');
        cookies().delete('isHost');

        // // Verify if the cookies are deleted
        // console.log('access-token:', cookies().get('access-token')); // Should be undefined
        // console.log('encrypted-uid:', cookies().get('encrypted-uid')); // Should be undefined
        // console.log('isHost:', cookies().get('isHost')); // Should be undefined

        // Sign out from Firebase

        // console.log('Successfully signed out from Firebase');

        // Optionally redirect the user after logout
        // window.location.href = '/'; // This will redirect the user to the homepage
    } catch (error) {
        console.error('Logout error: ', error);
    }
};
// export default async function handler(req: any, res: any) {
//     if (req.method !== "POST") {
//         return res.status(405).send({ message: "Only POST requests are allowed" });
//     }

//     const { token } = req.body;

//     try {
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         const uid = decodedToken.uid;
//         // Proceed with your server-side logic
//         res.status(200).send({ uid });
//     } catch (error) {
//         res.status(401).send("Unauthorized");
//     }
// }

// export { loginWithEmailAndPassword, signUpWithEmailAndPassword, signUpWithGoogle, logout };
