
// // import { cookies } from "next/headers";

// import { auth } from "@/firebase/firebaseConfig";
// import {
//   createUserWithEmailAndPassword,
//   GoogleAuthProvider,
//   signInWithEmailAndPassword,
//   signInWithRedirect,
//   getRedirectResult ,
//   signOut
// } from "firebase/auth";

// const setCookie = async (userCredential: any) => {
//   // console.log(userCredential);
//   // const session = cookies().get("session")?.value as string;
//   // console.log(session)
//   // cookies().delete(session)
//   // console.log('deleted session')
  
//   // const token = await userCredential.user.getIdToken();
//   // const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

//   // console.log(token);

//   // cookies().set("session", token, { expires, httpOnly: true });
// };

// const handleLogin = async (formData: FormData) => {
//   try {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//      // Sign out the old user if there's any
//     //  if (auth.currentUser) {
//     //     await signOut(auth);
//     //   }

//     const userCredential = await signInWithEmailAndPassword(
//       auth,
//       email,
//       password,
//     );
//     setCookie(userCredential);
//     return "success";
//   } catch (error) {
//     console.error("Login error: ", error);
//     return "error";
//     //   setError('Failed to log in. Please check your email and password.');
//   }
// };

// const handleGoogleSignUp = async () => {
//     // Sign out the old user if there's any
//     // if (auth.currentUser) {
//     //     await signOut(auth);
//     //   }
  
//     console.log('inside google function')

//   const provider = new GoogleAuthProvider();
//   console.log('after provider')
//   try {
//     const userCredential = await signInWithRedirect(auth, provider);
//     setCookie(userCredential);
//     return 'success'
//   } catch (error) {
//     console.error("Google sign-up error: ", error);
//     return 'error'
//     //   setError('Failed to sign up with Google. Please try again.');
//   }
// };

// const handleSignUp = async (formData: FormData) => {
//   try {
//     const email = formData.get("email") as string;
//     const password = formData.get("password") as string;

//     // Sign out the old user if there's any
//     if (auth.currentUser) {
//         await signOut(auth);
//       }

//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       email,
//       password,
//     );
//     setCookie(userCredential);
//     return "success";
//   } catch (error) {
//     console.error("Sign-up error: ", error);
//     return "error";
//   }
// };

// export { handleLogin, handleGoogleSignUp, handleSignUp };
