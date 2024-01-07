"use client";
import { useAppSelector } from "@/app/globalRedux/store";
import axios from "@/app/utils/axios";
import { useToast } from "@chakra-ui/react";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem
} from "@nextui-org/react";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { logout } from "../globalRedux/features/authSlice";
import { getToken } from "../utils/auth";
import Notification from "./notification";
import SearchInput from "./search";



interface NavBarProps {
  onToggleSidebar: () => void;
}

export default function NavBar({ onToggleSidebar: onToggleSidebar }: NavBarProps) {
  const currentuser = useAppSelector((state) => state.authReducer.value.user);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const newNotification = useAppSelector((state) => state.authReducer.value.newNotification)


  const defaultAvatarUrl = "/placeholderuser.jpeg";
  // const AvatarImg = '/avatars' + currentuser?.profile?.avatar || defaultAvatarUrl;
  const AvatarImg = currentuser?.profile?.avatar || defaultAvatarUrl;
  const dispatch = useDispatch();
  const handleSettingsClick = () => {
    router.push('/settings');
  };
  const handleSignedInAsClick = () => {
    router.push('/Profile');
  };

  const handleLogoutClick = () => {
    const token = getToken();

    axios.post('/auth/logout' , {
      headers : {
        Authorization : token
      }
    }).then(()=>{
      router.push('/');
      localStorage.removeItem('2fa');
      localStorage.removeItem('access_token');
      localStorage.removeItem('auth');
      deleteCookie('token');
      dispatch(logout());
    }).catch(()=> {
      console.log('hamid machina fiha ');
    })
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`/users/me`, {
          headers: {
            Authorization: getToken(),
          },
        });
        console.log(data.data);
        setUser(data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Navbar maxWidth="full" className="bg-[#151424] border-b-[#1A3070]">
      <NavbarContent className="flex justify-between items-center">
        <NavbarItem className="lg:block md:block hidden">
          <Image
            src="/Logo.png"
            alt="PONG Logo"
            width={90}
            height={90}
            style={{ width: "auto", height: "auto" }}
          />
        </NavbarItem>

        <button className="lg:hidden md:hidden" onClick={onToggleSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="16" viewBox="0 0 48 36" fill="none">
            <path d="M3 2.5H45" stroke="#77DFF8" strokeWidth="5" strokeLinecap="round" />
            <path d="M3 18H45" stroke="#77DFF8" strokeWidth="5" strokeLinecap="round" />
            <path d="M3 33H45" stroke="#77DFF8" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </button>
        <NavbarItem className="grow flex justify-center items-center">
          <div className="navbar flex justify-center items-center">
            <SearchInput />
          </div>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              {
                newNotification ? (
                  <svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#2859C5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
                    <path fill="#2859C5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.63 12.63 0 0 1-1.35-4.81v-4.94a10.92 10.92 0 0 0-.16-1.79a7.44 7.44 0 0 1-2.24-.84a8.89 8.89 0 0 1 .4 2.64v4.94a14.24 14.24 0 0 0 1.65 5.85a16.17 16.17 0 0 0 2.44 3H5.13a16.17 16.17 0 0 0 2.44-3a14.24 14.24 0 0 0 1.65-5.85v-4.95A8.8 8.8 0 0 1 18 6.31a8.61 8.61 0 0 1 4.76 1.44A7.49 7.49 0 0 1 22.5 6v-.63a10.58 10.58 0 0 0-3.32-1V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.3 10.73v4.94a12.63 12.63 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75" />
                    <circle cx="30" cy="6" r="5" fill="red" />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>

                ) : (
                  <svg width="24" height="24" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#2859C5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.63 12.63 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.63 12.63 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75M5.13 28.94a16.17 16.17 0 0 0 2.44-3a14.24 14.24 0 0 0 1.65-5.85v-4.94a8.74 8.74 0 1 1 17.47 0v4.94a14.24 14.24 0 0 0 1.65 5.85a16.17 16.17 0 0 0 2.44 3Z" />
                    <path fill="#2859C5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
                    <path fill="none" d="M0 0h36v36H0z" />
                  </svg>
                )
              }
            </DropdownTrigger>
            <DropdownMenu
              className="bg-[#323054] text-white"
              aria-label="Profile Actions"
              variant="flat"
              closeOnSelect={false}
            >
              <DropdownItem textValue="notif">
                <Notification user={user} />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
        <NavbarItem className="grow-0">
          <Dropdown backdrop="blur" placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="hamid"
                size="sm"
                src={AvatarImg}
              />
            </DropdownTrigger>
            <DropdownMenu
              className="bg-[#323054] text-white"
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownItem
                key="profile"
                className="h-14 gap-2 hover:bg-[#504e89]"
                textValue={`Signed in as ${currentuser?.email}`}
                onClick={() => handleSignedInAsClick()}
              >
                <p className="font-regular text-[#f6e4fb]">Signed in as</p>
                <p className="font-light text-[#73d3ff] text-sm">{currentuser?.email}</p>
              </DropdownItem>

              <DropdownItem
                className="hover:bg-[#504e89]"
                key="settings"
                onClick={() => handleSettingsClick()}
                textValue="Settings"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 82 82" fill="none">
                    <path d="M79.8735 49.6735C77.4735 47.3735 76.1735 44.1735 76.1735 40.8735C76.1735 37.5735 77.4735 34.4735 79.8735 32.0735C80.2735 31.6735 80.6735 31.3735 81.1735 30.9735C81.8735 30.4735 82.0735 29.5735 81.8735 28.7735C81.0735 25.8735 79.8735 23.0735 78.4735 20.4735C78.0735 19.7735 77.2735 19.3735 76.4735 19.4735C75.7735 19.5735 75.2735 19.5735 74.7735 19.5735C67.8735 19.5735 62.2735 13.9735 62.2735 7.17351C62.2735 6.67351 62.2735 6.07351 62.3735 5.47351C62.4735 4.67351 62.0735 3.87351 61.3735 3.47351C58.7735 2.07351 55.9735 0.873507 53.0735 0.0735065C52.2735 -0.126493 51.3735 0.173506 50.8735 0.773506C50.4735 1.27351 50.0735 1.77351 49.7735 2.07351C47.3735 4.37351 44.2735 5.67351 40.9735 5.67351C37.6735 5.67351 34.4735 4.37351 32.1735 2.07351C31.7735 1.67351 31.4735 1.27351 31.0735 0.773506C30.5735 0.0735063 29.6735 -0.126493 28.8735 0.0735065C25.9735 0.973506 23.1735 2.07351 20.5735 3.47351C19.8735 3.87351 19.4735 4.67351 19.5735 5.47351C19.6735 6.17351 19.6735 6.67351 19.6735 7.17351C19.6735 14.0735 14.0735 19.5735 7.17351 19.5735C6.67351 19.5735 6.07351 19.5735 5.47351 19.4735C4.67351 19.3735 3.87351 19.7735 3.47351 20.4735C2.07351 23.0735 0.873507 25.8735 0.0735065 28.7735C-0.126493 29.5735 0.0735063 30.4735 0.773506 30.9735C1.37351 31.3735 1.77351 31.7735 2.07351 32.0735C6.97351 36.8735 6.97351 44.7735 2.07351 49.6735C1.67351 50.0735 1.27351 50.3735 0.773506 50.7735C0.0735063 51.2735 -0.126493 52.1735 0.0735065 52.9735C0.973506 55.8735 2.07351 58.6735 3.47351 61.2735C3.87351 61.9735 4.67351 62.3735 5.47351 62.2735C6.17351 62.1735 6.67351 62.1735 7.17351 62.1735C14.0735 62.1735 19.6735 67.7735 19.6735 74.5735C19.6735 75.0735 19.6735 75.6735 19.5735 76.2735C19.4735 77.0735 19.8735 77.8735 20.5735 78.2735C23.1735 79.6735 25.9735 80.8735 28.8735 81.6735C29.6735 81.8735 30.5735 81.6735 31.0735 80.9735C31.4735 80.4735 31.8735 79.9735 32.1735 79.6735C34.5735 77.3735 37.6735 76.0735 40.9735 76.0735C44.2735 76.0735 47.4735 77.3735 49.7735 79.6735C50.1735 80.0735 50.4735 80.4735 50.8735 80.9735C51.2735 81.4735 51.8735 81.7735 52.4735 81.7735C52.6735 81.7735 52.8735 81.7735 53.0735 81.6735C55.9735 80.7735 58.7735 79.6735 61.3735 78.2735C62.0735 77.8735 62.4735 77.0735 62.3735 76.2735C62.2735 75.5735 62.2735 75.0735 62.2735 74.5735C62.2735 67.6735 67.8735 62.1735 74.7735 62.1735C75.2735 62.1735 75.8735 62.1735 76.4735 62.2735C77.2735 62.3735 78.0735 61.9735 78.4735 61.2735C79.8735 58.6735 81.0735 55.8735 81.8735 52.9735C82.0735 52.1735 81.8735 51.2735 81.1735 50.7735C80.6735 50.3735 80.1735 50.0735 79.8735 49.6735ZM75.5735 58.1735H74.6735C65.5735 58.1735 58.1735 65.5735 58.1735 74.5735V75.4735C56.5735 76.2735 54.8735 76.9735 53.0735 77.5735L52.4735 76.9735C49.3735 73.8735 45.2735 72.1735 40.8735 72.1735C36.4735 72.1735 32.3735 73.8735 29.2735 76.9735L28.6735 77.5735C26.9735 76.9735 25.2735 76.2735 23.5735 75.4735V74.5735C23.5735 65.4735 16.1735 58.1735 7.07351 58.1735H6.17351C5.37351 56.5735 4.67351 54.8735 4.07351 53.0735L4.67351 52.4735C11.0735 46.0735 11.0735 35.6735 4.67351 29.1735L4.07351 28.5735C4.67351 26.8735 5.37351 25.1735 6.17351 23.4735H7.07351C16.1735 23.4735 23.5735 16.0735 23.5735 7.07351V6.17351C25.1735 5.37351 26.8735 4.67351 28.6735 4.07351L29.2735 4.67351C32.3735 7.77351 36.4735 9.47351 40.8735 9.47351C45.2735 9.47351 49.3735 7.77351 52.4735 4.67351L53.0735 4.07351C54.7735 4.67351 56.4735 5.37351 58.1735 6.17351V7.07351C58.1735 16.1735 65.5735 23.4735 74.6735 23.4735H75.5735C76.3735 25.0735 77.0735 26.7735 77.6735 28.5735L77.0735 29.1735C73.9735 32.2735 72.2735 36.3735 72.2735 40.7735C72.2735 45.1735 73.9735 49.2735 77.0735 52.3735L77.6735 52.9735C77.0735 54.8735 76.3735 56.5735 75.5735 58.1735ZM40.9735 17.0735C27.8735 17.0735 17.1735 27.7735 17.1735 40.8735C17.1735 53.9735 27.8735 64.6735 40.9735 64.6735C54.0735 64.6735 64.7735 53.9735 64.7735 40.8735C64.7735 27.7735 54.0735 17.0735 40.9735 17.0735ZM40.9735 60.6735C30.0735 60.6735 21.1735 51.7735 21.1735 40.8735C21.1735 29.9735 30.0735 21.0735 40.9735 21.0735C51.8735 21.0735 60.7735 29.9735 60.7735 40.8735C60.7735 51.7735 51.8735 60.6735 40.9735 60.6735Z" fill="#77DFF8" />
                  </svg>
                  <span className="ml-2 font-regular text-[#f6e4fb]">Settings</span>
                </div>
              </DropdownItem>


              <DropdownItem
                className="hover:bg-[#504e89]"
                key="logout"
                color="danger"
                onClick={() => handleLogoutClick()}
                textValue="Log Out"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                    <g clipPath="url(#clip0_1120_353)">
                      <path d="M15 24H1C0.4 24 0 23.6 0 23V1C0 0.4 0.4 0 1 0H15C15.6 0 16 0.4 16 1V8C16 8.6 15.6 9 15 9C14.4 9 14 8.6 14 8V2H2V22H14V16C14 15.4 14.4 15 15 15C15.6 15 16 15.4 16 16V23C16 23.6 15.6 24 15 24Z" fill="#77DFF8" />
                      <path d="M23 13H8C7.4 13 7 12.6 7 12C7 11.4 7.4 11 8 11H23C23.6 11 24 11.4 24 12C24 12.6 23.6 13 23 13Z" fill="#77DFF8" />
                      <path d="M23 13C22.7 13 22.5 12.9 22.3 12.7L18.3 8.7C17.9 8.3 17.9 7.7 18.3 7.3C18.7 6.9 19.3 6.9 19.7 7.3L23.7 11.3C24.1 11.7 24.1 12.3 23.7 12.7C23.5 12.9 23.3 13 23 13Z" fill="#77DFF8" />
                      <path d="M19 17C18.7 17 18.5 16.9 18.3 16.7C17.9 16.3 17.9 15.7 18.3 15.3L22.3 11.3C22.7 10.9 23.3 10.9 23.7 11.3C24.1 11.7 24.1 12.3 23.7 12.7L19.7 16.7C19.5 16.9 19.3 17 19 17Z" fill="#77DFF8" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1120_353">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="ml-2 font-regular text-[#f6e4fb]">Logout</span>
                </div>
              </DropdownItem>

            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export const SearchIcon = (props: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height="1em"
    role="presentation"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path
      d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
    <path
      d="M22 22L20 20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);