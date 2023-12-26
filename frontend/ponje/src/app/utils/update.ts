import axios from "./axios";
import { AxiosError } from "axios";



interface UserData {
  username?: string;
  bio?: string;
  email?: string;
}

export const updateUser = async (userData: UserData, token: string | null) => {
  try {
    const { username, bio, email } = userData;
    if (username || email) {
      const response = await axios.patch("/users", { username, email }, {
        headers: {
          Authorization: token,
        },
      });
      return { success: true, message: "Update successful", data: response.data };
    }
    if (bio) {
      const bioResponse = await axios.patch("/profiles", { bio }, {
        headers: {
          Authorization: token,
        },
      });
      console.log("updated bio", bioResponse.data);
    }
    return { success: true, message: "Update successful"};
  } catch (error) {
    console.error("Failed to update user:", error);
    
    const err = error as AxiosError;
    if (err.response?.status === 409) {
      const conflictError = {
        success: false,
        message: "Conflict error: Username or email already exists.",
      };
      throw conflictError;
    }
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


export const resetPassword = async (old: string, newpass: string, token: string | null) => {
  try {
    const response = await axios.post("/users/resetPassword", {
      old: old,
      new: newpass,
    }, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to reset password:", error);
    throw error;
  }
};
