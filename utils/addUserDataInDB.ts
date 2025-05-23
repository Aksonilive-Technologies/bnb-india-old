// import { AddUserData } from "@/actions/users.actions";

// const addUserDataInDB = async (data: any) => {
//     try {
//         const emailId = data.user.email
//         if (emailId != null || emailId != undefined) {
//             const userId = data.user.uid
//             const name = data.user.displayName || "";
//             const nameParts = name.split(" ");
//             const firstName = nameParts[0] || "";
//             const lastName = nameParts[1] || "";
//             const profileImage = data.user.photoURL
//             const phoneNumber = data.user.phoneNumber

//             const d: any = { userId, firstName, lastName, emailId, phoneNumber, profileImage }

//             const res = await AddUserData(d)
//             console.log(res)
//             return { sucesss: 200, data: d };
//         }
//     } catch (error) {
//         console.error(error);
//         return { sucesss: 400, error: error };
//     }

// }

// export { addUserDataInDB }



