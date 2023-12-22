" use client";
import axios from "@/app/utils/axios";
import { Toast } from "@chakra-ui/react";
import { AxiosError } from "axios";
import { setCookie } from "cookies-next";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export const fetchUserData = async (token: string) => {
  try {
    const response = await axios.get("/users/me", {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    Toast({
      title: "Error",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "bottom-right",
      variant: "solid",
    });
    console.log(error);
    return null;
  }
};

export const Handle42Auth = async () => {
  window.location.href = "http://localhost:3000/auth/api";
};

export const HandleGoogleAuth = async () => {
  window.location.href = "http://localhost:3000/auth/google";
};

export const verifyToken = (access_token?: string | null): boolean => {
  if (!access_token) {
    return false;
  }
  const decoded: JwtPayload = jwtDecode(access_token);

  return decoded.exp ? decoded.exp > Date.now() / 1000 : false;
};

export const setSession = (access_token?: string | null) => {
  if (access_token) {
    localStorage.setItem("access_token", access_token);
    axios.defaults.headers.common.authorization = `${access_token}`;
  } else {
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export const handleSignup = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const res = await axios.post("/auth/signUp", {
      username,
      email,
      password,
    });
    return await handleLogin(email, password);
  } catch (error) {
    Toast({
      title: "Error",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "bottom-right",
      variant: "solid",
    });
    const err = error as AxiosError;
    if (err.response && err.response.status === 409) {
      throw new ConflictError("User already exists");
    } else {
      console.log("Signup error:", error);
      throw error;
    }
  }
};

// export const handleLogin = async (email: string, password: string) => {
//   console.log("this got called :p");
//   try {
//     const Response = await axios.post("/auth/login", {
//       email,
//       password,
//     });

//     const { token } = Response.data;

//     const user = await fetchUserData(token);
//     if (Response.status === 201) {
//       setSession(token);
//       return { token, user };
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

export const handleLogin = async (email: string, password: string) => {
  try {
    console.log("this got called :p");
    const response = await axios.post("/auth/login", {
      email,
      password,
    });
    console.log(response);
    const { token } = response.data;
    if (response.status === 201) {
      const user = await fetchUserData(token);
      console.log(user);
      if (user) {
        setCookie("token", `${token}`);
        setSession(token);
        return { token, user };
      } else {
        console.log("User is undefined !!");
      }
    }
  } catch (error) {
    Toast({
      title: "Error",
      status: "error",
      duration: 9000,
      isClosable: true,
      position: "bottom-right",
      variant: "solid",
    });
    console.error(error);
  }
};

export const handleLogout = () => {
  const dispatch = useDispatch();
  setSession(null);
  dispatch({
    type: "auth/logout",
  });
};
