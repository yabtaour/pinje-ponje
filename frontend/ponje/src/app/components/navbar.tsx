"use client";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Navbar,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import Notification from "./notification";
import SearchInput from "./search";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/globalRedux/store";

export default function NavBar() {
  const currentuser = useAppSelector((state) => state.authReducer.value.user);
  const router = useRouter();
  const handleSettingsClick = () => {
    router.push('/settings');
  };
  return (
    <Navbar maxWidth="full" className="bg-[#151424] border-b-[#1A3070]">
      <NavbarContent className="flex justify-between">
        <NavbarItem className="grow-0">
          <Image src="/Logo.png" alt="PONG Logo" width={90} height={90}></Image>
        </NavbarItem>
        <NavbarItem className="grow flex justify-center ">
          <div className="navbar flex justify-center items-center">
            <SearchInput />
          </div>
        </NavbarItem>

        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <svg
                width="1.5em"
                height="1.5em"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="none" stroke="#2859C5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 19v-9a6 6 0 0 1 6-6v0a6 6 0 0 1 6 6v9M6 19h12M6 19H4m14 0h2m-9 3h2"
                  ></path>
                  <circle cx="12" cy="3" r="1"></circle>
                </g>
              </svg>
            </DropdownTrigger>
            <DropdownMenu
              className="bg-[#323054] text-white"
              aria-label="Profile Actions"
              variant="flat"
            >
              <DropdownItem>
                <Notification />
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
                name="Jason Hughes"
                size="sm"
                src={currentuser?.profile.avatar ?? undefined}
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
                // onClick={() => handleLogoutClick()}
                textValue="Log Out"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                    <g clip-path="url(#clip0_1120_353)">
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