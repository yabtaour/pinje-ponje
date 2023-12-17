'use client';
import React from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import { User } from "@/app/types/user";

export const PlayerSkeleton = () => {
  return (
    <div className="flex flex-col items-center ">
      <Card className="relative bg-[#26243f] w-36 md:w-60 flex items-center rounded-lg mb-8 border-double border-8 border-gray-700 " >
        <div className="absolute mt-12  justify-center shadow animate-pulse z-10">
          <div className=" h-16 md:h-28 mb-4 mask mask-hexagon bg-gray-300 rounded dark:bg-gray-700">
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
    </div>
  );
}




export default function PlayerCard({ user, cardColor }: { user: User | null | undefined; cardColor?: string }) {  
  const username = user?.username;
  const rank = user?.rank;
  const experience = user?.experience;
  const avatar = user?.profile?.avatar ?? "https://via.placeholder.com/150";
  console.log("suer : ", user);
  return (

    <div className="flex flex-col items-center ">
      <Card className="relative bg-[#26243f] w-36 md:w-60 lg:w-72 flex items-center rounded-lg" >
        <div className="absolute mt-12 flex items-center justify-center z-10">
          <CardHeader className="pb-0 flex-col items-center text-white">
            <Image
              alt="Card background"
              className="rounded-xl mb-2 md:h-28 md:w-28 lg:w-32 lg:h-32 mask mask-hexagon"
              src={avatar}
              width={120}
              height={120}
            />
            <p className="text-xs	md:text-base lg:text-lg uppercase font-bold text-[#81eeee]">{username}</p>
            <div className="badge bg-[#A499BE] border-none text-[#151424]">{rank}</div>
            <h4 className="font-semibold text-xs	md:text-base lg:text-lg">{experience} XP</h4>
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 64 64" fill="none">
              <g clipPath="url(#clip0_1134_387)">
                <path d="M31.9995 18.25L35.81 28.2071L46.4573 28.7541L38.165 35.455L40.9348 45.7503L31.9995 39.9346L23.064 45.7503L25.8341 35.455L17.5416 28.7541L28.1891 28.2071L31.9995 18.25Z" fill="#77DFF8" />
                <path d="M40.9348 47.5652C40.5906 47.5652 40.2464 47.4675 39.9448 47.2714L31.9993 42.0999L24.0538 47.2714C23.4235 47.6815 22.6056 47.6607 21.9971 47.2187C21.3886 46.7765 21.1161 46.0052 21.3114 45.279L23.7745 36.1244L16.401 30.1659C15.8161 29.6934 15.5833 28.9088 15.8155 28.1937C16.048 27.4784 16.6973 26.9807 17.4484 26.9422L26.9161 26.4558L30.3045 17.6017C30.5733 16.8994 31.2473 16.4355 31.9993 16.4355C32.7513 16.4355 33.4253 16.8994 33.694 17.6017L37.0824 26.4558L46.5501 26.9422C47.3011 26.9807 47.9506 27.4787 48.183 28.1937C48.4153 28.9089 48.1826 29.6934 47.5975 30.1659L40.224 36.1244L42.6871 45.279C42.8826 46.0052 42.6099 46.7765 42.0014 47.2187C41.6843 47.4493 41.3098 47.5652 40.9348 47.5652ZM31.9995 38.12C32.344 38.12 32.6885 38.218 32.9895 38.4138L37.9505 41.6425L36.4125 35.9267C36.226 35.2333 36.4659 34.495 37.0244 34.0437L41.6283 30.3233L35.7169 30.0197C34.9998 29.9828 34.3718 29.5265 34.1151 28.8559L31.9995 23.3277L29.8839 28.8559C29.6273 29.5264 28.9991 29.9827 28.2821 30.0197L22.3708 30.3233L26.9746 34.0437C27.5333 34.495 27.7729 35.2333 27.5865 35.9267L26.0485 41.6425L31.0095 38.4138C31.3105 38.2178 31.6549 38.12 31.9995 38.12Z" fill={cardColor} />
                <path d="M31.9995 64C23.452 64 15.4161 60.6714 9.37202 54.6275C8.66339 53.9189 8.66339 52.7697 9.37202 52.0609C10.0806 51.3522 11.2298 51.3522 11.9386 52.0609C17.297 57.4195 24.4215 60.3704 31.9996 60.3704C39.5778 60.3704 46.7021 57.4194 52.0606 52.0609C57.4189 46.7025 60.37 39.578 60.37 32C60.37 24.422 57.419 17.2975 52.0605 11.939C46.7019 6.58038 39.5776 3.6295 31.9995 3.6295C24.4214 3.6295 17.297 6.5805 11.9386 11.939C4.78164 19.096 1.97264 29.6202 4.60739 39.405C4.86802 40.3727 4.29477 41.3685 3.32689 41.6291C2.35939 41.8895 1.36339 41.3165 1.10276 40.3486C-0.334985 35.0098 -0.36686 29.3566 1.01077 24.0006C2.43002 18.4816 5.32152 13.4234 9.37214 9.3725C15.416 3.32863 23.452 0 31.9995 0C40.547 0 48.5829 3.32863 54.627 9.3725C60.671 15.4165 63.9995 23.4524 63.9995 32C63.9995 40.5476 60.6709 48.5834 54.627 54.6275C48.5829 60.6714 40.547 64 31.9995 64Z" fill={cardColor} />
                <path d="M31.9995 56.5031C18.4881 56.5031 7.49597 45.5108 7.49597 31.9996C7.49597 18.4883 18.4881 7.49609 31.9995 7.49609C40.7407 7.49609 48.8832 12.207 53.2491 19.7905C53.7491 20.659 53.4504 21.7686 52.5819 22.2687C51.7135 22.7688 50.6037 22.4701 50.1036 21.6015C46.3836 15.1398 39.4464 11.1256 31.9995 11.1256C20.4895 11.1256 11.1255 20.4897 11.1255 31.9996C11.1255 43.5095 20.4896 52.8736 31.9995 52.8736C43.5094 52.8736 52.8735 43.5095 52.8735 31.9996C52.8735 30.9973 53.686 30.1848 54.6882 30.1848C55.6905 30.1848 56.503 30.9973 56.503 31.9996C56.503 45.511 45.5106 56.5031 31.9995 56.5031Z" fill={cardColor} />
              </g>
              <defs>
                <clipPath id="clip0_1134_387">
                  <rect width="64" height="64" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </CardHeader>
        </div>
        <div className="flex items-center relative z-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="195" height="360" viewBox="0 0 295 620" fill="none" className="md:w-48 md:h-96">
            <path d="M0 611.143V8C0 3.58172 3.58172 0 7.99999 0H287C291.418 0 295 3.58172 295 8V611.143C295 618.205 286.518 621.803 281.44 616.895L153.06 492.822C149.959 489.826 145.041 489.826 141.94 492.822L13.5595 616.895C8.48174 621.803 0 618.205 0 611.143Z" fill={cardColor} />
          </svg>
        </div>
        <CardBody className="overflow-visible py-2 ">
        </CardBody>
      </Card>
    </div>
  );
}
