'use server'
import { setPersistence, inMemoryPersistence, getIdToken } from 'firebase/auth';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';
// import { setCookie } from 'cookies-next';
import { cookies } from 'next/headers'
import { signOut } from "firebase/auth";
import { redirect } from 'next/navigation'


const loginWithUserNameAndEmail = async (email: string, password: string): Promise<string | undefined> => {
    try {
        await setPersistence(auth, inMemoryPersistence);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await getIdToken(userCredential.user);
            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            cookies().set("access-token", idToken, { expires, httpOnly: true });
            return '200';
        } catch (error) {
            console.log('Login error: ', error);
            return '401';
        }
    } catch (error) {
        console.error('Login error: ', error);
        return '400';
    }
};


const googleLogin = async (): Promise<string | undefined> => {
    try {
        const provider = new GoogleAuthProvider();
        await setPersistence(auth, inMemoryPersistence);

        try {
            const userCredential = await signInWithPopup(auth, provider);
            const idToken = await getIdToken(userCredential.user);
            const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            cookies().set("access-token", idToken, { expires, httpOnly: true });
            return '200';
        } catch (error) {
            console.log('Login error: ', error);
            return '401';
        }
    } catch (error) {
        console.error('Login error: ', error);
        return '400';
    }
};

const logout  = async () =>{ 
    cookies().delete('access-token')

    await signOut(auth);
    redirect("/")
}

export {loginWithUserNameAndEmail, googleLogin, logout}