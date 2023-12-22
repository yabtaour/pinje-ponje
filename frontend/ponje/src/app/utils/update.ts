import axios from "./axios";
import { Toast } from '@chakra-ui/react';


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

export const fetchTwoFactorStatus = async (token: string | null) => {
  try {
    const response = await axios.get('/users', {
      headers: {
        Authorization: token,
      },
    });
    console.log("the value of twofa from db", response.data.twoFactor);
    return response.data.twoFactor;
  } catch (error) {
    console.error('Error fetching 2FA status:', error);
    throw error;
  }
};


export const getGameData = async (token : string | null) => {
  try {

      const res = await axios.post(`http://localhost:3000/game/queue`, {}, {
          headers: {
              Authorization: token,
          },
      });
      return res.data;
  } catch (err) {
      console.error(err);
  }
};

export const fetchGameHistory = async (id : number, token : string | null) => {
  try {
      const res = await axios.get('/game/user/' + id, {
          headers: {
              'Authorization': `${localStorage.getItem('access_token')}`
          }
      });
      return res.data;
  } catch (err) {
      console.log(err);
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
