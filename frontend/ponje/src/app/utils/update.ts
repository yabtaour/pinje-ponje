import axios from "./axios";

interface userData {
  username?: string | undefined;
  bio?: string | undefined;
  email?: string | undefined;
}

export const updateUser = async (userData: userData, token: string | null) => {
  

  try {
    const response = await axios.patch("/profiles", userData, {
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

export const fetchQRCode = async (token: string | null) => {
  try {
    const response = await axios.get("/users/QRCode", {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Failed to fetch QRCode:", error);
    throw error;
  }
}

// Get users/QRCode
// POST users/resetPassword

export const resetPassword = async (old: string, newpass: string) => {
  try {
    const response = await axios.post("/users/resetPassword", {
      old,
      newpass,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to reset password:", error);
    throw error;
  }
};

