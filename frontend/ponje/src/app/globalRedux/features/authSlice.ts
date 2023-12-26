"use client";

import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: AuthState;
};

type User = {
  googleId: any;
  id: number | undefined;
  intraid?: number;
  Hashpassword?: string | null;
  username?: string;
  email?: string;
  twofactor?: boolean;
  twoFactorSecret?: string | null;
  twoFactorFlag?: boolean;
  profile?: {
    id: number;
    login?: string;
    avatar?: string | null;
    phonenumber?: string | null;
    status?: string;
    Rank?: string;
    level?: number;
    Friends?: [];
    createdAt?: string;
    updatedAt?: string;
    friendOf?: [];
    pendingRequest?: [];
    sentRequest?: [];
    userid?: number;
    bio?: string | null;
  };
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
};

const initialState = {
  value: {
    isAuthenticated: false,
    token: null,
    user: null,
  } as AuthState,
} as InitialState;

export const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      console.log("Login payload:", action.payload);
      if (action.payload.user && action.payload.user.id) {
        const newState = {
          isAuthenticated: true,
          token: action.payload.token,
          user: action.payload.user,
        };
        localStorage.setItem("auth", JSON.stringify(newState));
        return { ...state, value: newState };
      } else {
        console.error("Invalid payload structure for login");
        return state;
      }
    },
    logout: () => initialState,
    UpdateUser(state, action) {
      const newUser = action.payload;
      if (newUser && newUser.id !== undefined) {
        const updatedUser = { ...state.value.user, ...newUser };
        const updatedState: InitialState = {
          value: {
            ...state.value,
            user: updatedUser,
          },
        };
        localStorage.setItem("auth", JSON.stringify(updatedState.value));
        return updatedState;
      } else {
        console.error("Invalid payload structure for UpdateUser");
        return state;
      }
    },

    setVerified(state, action) {
      const newState: InitialState = {
        value: {
          ...state.value,
          user: {
            ...state.value.user,
            id: state.value.user?.id,
            twoFactorFlag: action.payload,
          },
        },
      };
      localStorage.setItem("auth", JSON.stringify(newState.value));
      return newState;
    },
  },
});

export const { login, logout, UpdateUser , setVerified } = auth.actions;
export default auth.reducer;
