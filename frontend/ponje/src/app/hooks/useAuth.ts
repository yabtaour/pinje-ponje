import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../globalRedux/store";
import axios from "axios";
import { login, logout } from "../globalRedux/features/authSlice";

// function getCookie(name: string) {
//   const cookies = document.cookie.split(";");
//   for (const cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.trim().split("=");
//     if (cookieName === name) {
//       return decodeURIComponent(cookieValue);
//     }
//   }
//   return null;
// }

export const useAuth = () => {
  // const authState = useAppSelector((state) => state.authReducer.value);

  // return { authState };

  // const [isLoading, setIsLoading] = useState(true);

  // const authState = useAppSelector((state) => state.authReducer.value);

  // useEffect(() => {
  //   const token = getCookie("token");
  //   console.log("token", token);
  //   if (token) {
  //     console.log("token", token);
  //   }
  //   setIsLoading(false);

  //     const urlParams = new URLSearchParams(window.location.search);
  //     const code = urlParams.get("code");
  //     if (code) {
  //       console.log("code", code);
  //       localStorage.setItem("token", code);

  //       axios
  //         .get(`http://localhost:3000/users/2`, {
  //           headers: {
  //             Authorization:
  //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjJ9.1Jq_aUByCv1k2NY4GZIuYL3ui-Nvf1RKpRp8dyjK2Sg",
  //             // Authorization: `${code}`,
  //           },
  //         })
  //         .then((profileResponse) => {
  //           console.log("login");
  //           console.log(profileResponse.data);
  //           dispatch(
  //             login({
  //               user: {
  //                 id: profileResponse.data.id,
  //                 intraid: profileResponse.data.intraid,
  //                 email: profileResponse.data.email,
  //                 twofactor: profileResponse.data.twofactor,
  //                 twoFactorSecret: profileResponse.data.twoFactorSecret,
  //                 profile: {
  //                   id: profileResponse.data.profile.id,
  //                   username: profileResponse.data.profile.username,
  //                   login: profileResponse.data.profile.login,
  //                   avatar: profileResponse.data.profile.avatar,
  //                   phonenumber: profileResponse.data.profile.phonenumber,
  //                   status: profileResponse.data.profile.status,
  //                 },
  //               },
  //               token: code,
  //               isAuthenticated: true,
  //             })
  //           );
  //         })
  //         .catch((error) => {
  //           dispatch(logout());
  //         });
  //       dispatch(logout());
  //     }
  // }, []);

  // return { authState };
};
