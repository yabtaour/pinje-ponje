'use client';
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Loader from "@/app/components/loader";
import axios from "@/app/utils/axios";
import { useEffect, useState } from "react";
import { DisplayedInfo } from "../page";

export const PlayerSkeleton = () => {
  return (
    <Card className="py-4 bg-[#1B1A2D] w-1/6 flex items-center rounded-lg mt-96">
      <div className="absolute mt-12 justify-center shadow animate-pulse z-10">
        <div className=" h-28 mb-4 mask mask-hexagon bg-gray-300 rounded dark:bg-gray-700">
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
      </div>
      <div className="flex items-center relative z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="195" height="360" viewBox="0 0 295 620" fill="#1B1A2D" opacity={0}>
          <path d="M0 611.143V8C0 3.58172 3.58172 0 7.99999 0H287C291.418 0 295 3.58172 295 8V611.143C295 618.205 286.518 621.803 281.44 616.895L153.06 492.822C149.959 489.826 145.041 489.826 141.94 492.822L13.5595 616.895C8.48174 621.803 0 618.205 0 611.143Z" fill="#4A40BF" />
        </svg>
      </div>
    </Card>
  );
}




export default function PlayerCard({ user }: { user: DisplayedInfo }) {
  return (
    <div className="flex flex-col items-center ">
      <Card className="relative bg-[#26243f] w-2/4 flex items-center rounded-lg">
        <div className="absolute mt-12 flex items-center justify-center z-10">
          <CardHeader className="pb-0 flex-col items-center text-white">
            <Image
              alt="Card background"
              className="rounded-xl mask mask-hexagon mb-2"
              src="https://via.placeholder.com/150"
              width={120}
              height={120}
            />
            <p className="text-tiny uppercase font-bold text-[#81eeee]">{user.username}</p>
            <div className="badge bg-[#A499BE] border-none text-[#151424]">{user.rank}</div>
            <h4 className="font-semibold text-large">{user.experience} XP</h4>
          </CardHeader>
        </div>
        <div className="flex items-center relative z-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="195" height="360" viewBox="0 0 295 620" fill="none">
            <path d="M0 611.143V8C0 3.58172 3.58172 0 7.99999 0H287C291.418 0 295 3.58172 295 8V611.143C295 618.205 286.518 621.803 281.44 616.895L153.06 492.822C149.959 489.826 145.041 489.826 141.94 492.822L13.5595 616.895C8.48174 621.803 0 618.205 0 611.143Z" fill="#4A40BF" />
          </svg>
        </div>
        <CardBody className="overflow-visible py-2 ">
        </CardBody>
      </Card>
      <button className="btn btn-sm h-12 bg-[#4E40F4] mt-10 mb-10">
        Join matchmaking
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C8.55 2 2.5 8.05 2.5 15.5C2.5 22.95 8.55 29 16 29C16.53 29 17.051 28.962 17.566 28.902L17.582 28.918L17.6 28.898C24.296 28.105 29.5 22.408 29.5 15.5C29.5 8.593 24.296 2.9 17.602 2.105C17.585 2.091 17.57 2.075 17.552 2.061V2.055L17.522 2.092C17.021 2.035 16.514 2 16 2ZM15.5 3.025V8H11.16C12.077 6.057 13.334 4.372 14.836 3.059C15.055 3.039 15.278 3.034 15.5 3.025ZM16.5 3.025C16.723 3.035 16.947 3.038 17.166 3.059C18.671 4.372 19.931 6.054 20.85 8H16.5V3.025ZM13.076 3.357C11.8117 4.72297 10.7873 6.29273 10.046 8H6.015C7.75713 5.67785 10.2535 4.03592 13.076 3.357ZM18.922 3.357C21.7453 4.03541 24.2434 5.67741 25.986 8H21.96C21.2167 6.29216 20.1889 4.72235 18.922 3.357ZM5.336 9H9.646C8.94326 10.9247 8.56086 12.9516 8.514 15H3.525C3.60535 12.8781 4.22953 10.8123 5.336 9ZM10.738 9H15.5V15H9.514C9.56888 12.9439 9.98313 10.9133 10.738 9ZM16.5 9H21.27C22.025 10.9133 22.4392 12.9439 22.494 15H16.5V9ZM22.36 9H26.664C27.7705 10.8123 28.3937 12.8781 28.474 15H23.494C23.4462 12.9514 23.0628 10.9245 22.359 9H22.36ZM3.524 16H8.513C8.55979 18.0484 8.94219 20.0753 9.645 22H5.334C4.22809 20.1875 3.60527 18.1217 3.525 16H3.524ZM9.513 16H15.5V22H10.738C9.98315 20.0867 9.5689 18.0561 9.514 16H9.513ZM16.499 16H22.468C22.362 17.883 21.848 19.953 20.95 22H16.5L16.499 16ZM23.469 16H28.474C28.3937 18.1217 27.7709 20.1875 26.665 22H22.036C22.879 19.97 23.371 17.916 23.469 16ZM6.015 23H10.048C10.7893 24.7073 11.8137 26.277 13.078 27.643C10.2543 26.965 7.75565 25.323 6.013 23H6.015ZM11.161 23H15.501V27.975C15.28 27.965 15.057 27.961 14.839 27.941C13.335 26.628 12.079 24.945 11.161 23ZM16.501 23H20.464C19.5719 24.7929 18.4406 26.4564 17.101 27.945C16.903 27.963 16.701 27.967 16.501 27.975V23ZM21.589 23H25.987C24.1797 25.4155 21.5581 27.0942 18.608 27.725C19.7872 26.2754 20.7874 24.6889 21.587 23H21.589Z" fill="white" />
          <circle cx="23" cy="11" r="2" fill="#77DFF8" />
          <circle cx="9" cy="17" r="2" fill="#77DFF8" />
          <circle cx="23" cy="23" r="2" fill="#77DFF8" />
        </svg>
      </button>
      {/* <PlayerSkeleton /> */}
    </div>
  );
}
