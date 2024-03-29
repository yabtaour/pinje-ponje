" use client";
import axios from "@/app/utils/axios";
import { AxiosError } from "axios";
import { getCookie, setCookie } from "cookies-next";
import { JwtPayload, jwtDecode } from "jwt-decode";

export type KeyedObject = {
  [key: string]: string | number | KeyedObject | any;
};

export const getToken = () => {
  const token = getCookie("token");
  if (token) {
    return token;
  }
  return null;
};

export const tokenVerification = async (token?: string | null | undefined) => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-token`, {
      headers: {
        Authorization: `${token}`,
      },
    })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
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
    return null;
  }
};

export const Handle42Auth = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/api`;
};

export const HandleGoogleAuth = async () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
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
    axios.defaults.headers.common.authorization = `${access_token}`;
  } else {
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
    const err = error as AxiosError;
    if (err.response && err.response.status === 409) {
      throw new ConflictError("User already exists");
    } else {
      throw error;
    }
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post("/auth/login", {
      email,
      password,
    });

    const { token } = response.data;
    if (response.status === 201) {
      const user = await fetchUserData(token);
      if (user) {
        setCookie("token", `${token}`);
        setSession(token);
        return { token, user };
      }
    }
  } catch (error) {
    const err = error as AxiosError;
    throw err;
  }
};
