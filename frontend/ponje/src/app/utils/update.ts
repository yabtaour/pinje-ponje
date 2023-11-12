import axios from "./axios";


interface userData {
    username: string;
    bio: string;
    email: string;
}


export const updateUser = async (userData : userData, token : string) => {
    try {
        const response = await axios.patch('/users/me', userData, {
            headers: {
                Authorization: token,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update user:", error);
        throw error;
    }
};

// Get users/QRCode
// POST users/resetPassword

export const resetPassword = async (old : string, newpass : string) => {
    try {
        const response = await axios.post('/users/resetPassword', {
            old,
            newpass,
        });
        return response.data;
    } catch (error) {
        console.error("Failed to reset password:", error);
        throw error;
    }
};
