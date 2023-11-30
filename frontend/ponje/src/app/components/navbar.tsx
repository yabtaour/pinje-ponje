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

export default function NavBar() {
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
                src="cartman.png"
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
              >
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">hamid@jimayl.com</p>
              </DropdownItem>
              <DropdownItem className="hover:bg-[#504e89]" key="settings">
                Settings
              </DropdownItem>
              <DropdownItem
                className="hover:bg-[#504e89]"
                key="logout"
                color="danger"
              >
                Log Out
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
