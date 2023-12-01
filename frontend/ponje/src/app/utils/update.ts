import axios from "./axios";

interface userData {
  username?: string | undefined;
  bio?: string | undefined;
  email?: string | undefined;
  // twoFactor?: boolean | undefined;
}

export const updateUser = async (userData: userData, token: string | null) => {
  
  console.log("the user is getting updated B)");
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



// {
//   "id": 93,
//   "username": "Soukaina",
//   "email": "sabbajisoukaina@gmail.com",
//   "intraid": null,
//   "googleId": "106733394767828313508",
//   "twoFactor": true,
//   "twoFactorSecret": "HZWBCGRNOBLTIQCE",
//   "status": "ONLINE",
//   "winRate": 0,
//   "accuracy": 0,
//   "consitency": 0,
//   "reflex": 0,
//   "gamePoints": 0,
//   "rank": "UNRANKED",
//   "level": 0,
//   "experience": 0,
//   "gameInvitesSent": 0,
//   "createdAt": "2023-11-29T12:16:13.377Z",
//   "updatedAt": "2023-11-29T13:30:53.411Z",
//   "profile": {
//     "id": 93,
//     "bio": "I am a new player",
//     "avatar": null,
//     "userid": 93,
//     "createdAt": "2023-11-29T12:16:13.377Z",
//     "updatedAt": "2023-11-29T13:30:54.405Z"
//   }
// }

// some fields moved from profile to user