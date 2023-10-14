"use client";

import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: AuthState;
};

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  user: any;
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
      state.value = {
        isAuthenticated: true,
        token: null,
        user: action.payload,
      };

      return state;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { login, logout } = auth.actions;
export default auth.reducer;

// {
//   "id": 1,
//   "intraid": 93968,
//   "Hashpassword": null,
//   "email": "yabtaour@student.1337.ma",
//   "twofactor": false,
//   "twoFactorSecret": null,
//   "profile": {
//       "id": 1,
//       "username": "yabtaour",
//       "login": "yabtaour",
//       "avatar": null,
//       "phonenumber": null,
//       "status": "ONLINE",
//       "Rank": "UNRANKED",
//       "level": 0,
//       "Friends": [],
//       "createdAt": "2023-08-17T13:26:41.568Z",
//       "updatedAt": "2023-08-17T13:26:41.568Z",
//       "userid": 1
//   }
// },
