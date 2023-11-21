" use client";
import axios from "@/app/utils/axios";
import { JwtPayload, jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export function getCookie(key: string) {}

export const fetchUserData = async (token: string ) => {
  try {
    const response = await axios.get("/users/me", {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
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
    axios.defaults.headers.common.Authorization =  `Bearer ${access_token}`;
  } else {
    localStorage.removeItem("access_token");
    delete axios.defaults.headers.common.Authorization;
  }
};

export const handleSignup = async (email: string, password: string) => {
  try {
    await axios.post("/auth/signup", {
      username: "hamid22",
      email,
      password,
    });
    return await handleLogin(email, password);
  } catch (error) {
    console.log(error);
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const Response = await axios.post("/auth/login", {
      email,
      password,
    });

    const { token } = Response.data;

    const user = await fetchUserData(token);
    if (Response.status === 201) {
      setSession(token);
      return { token, user };
    }
  } catch (error) {
    console.log(error);
  }
};

export const handleLogout = () => {
  const dispatch = useDispatch();
  setSession(null);
  dispatch({
    type: "auth/logout",
  });
};
