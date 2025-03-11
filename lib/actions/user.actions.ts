'use server';

import { cookies } from "next/headers";

export const signIn = async () => {
    try {
        // Mutation / Database / Fetch

    } catch (error) {
        console.error('Error', error);
    }
}

// export const signUp = async (userData: SignUpParams) => {
//     try {
//         // Create user params
//     } catch (error) {
//         console.error('Error', error);
//     }
// }

// export const getLoggedInUser = async (userData: SignUpParams) => {
//     try {
//         // Create user params
//     } catch (error) {
//         console.error('Error', error);
//     }
// }

// export const logoutAccount = async (userData: SignUpParams) => {
//     try {
//         cookies().delete('mongo-session')
//     } catch (error) {
//         console.error('Error', error);
//     }
// }