'use client';
import React from "react";
import { User } from '../../../types/user';
import Image from "next/image";


export default function ScoreCard({ playerOne, playerTwo, myScore, enemyScore }: { playerOne: User | null | undefined, playerTwo: User | null | undefined, myScore: number, enemyScore: number }) {
    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-lg">
            <div className="flex items-center">
                {playerOne && (
                    <>
                        <Image
                            src={playerOne?.profile?.avatar ?? "/placeholderuser.jpeg"}
                            alt="User Avatar"
                            width={18}
                            height={18}
                            className="w-full mask mask-squircle h-full object-cover rounded-full mr-2 lg:w-16 lg:h-16"
                        />
                        <div className="flex flex-row">
                            <p className="text-sm md:text-lg font-bold mr-3">{playerOne.username}</p>
                            <div className="badge badge-neutral text-white bg-[#77DFF8]">you</div>
                        </div>
                    </>
                )}
            </div>

            <div className="flex items-center">
                <p className="text-[#77DFF8] text-xl lg:text-4xl">{myScore}</p>
                <div className="divider divider-horizontal before:bg-secondary after:bg-secondary"></div>
                <p className="text-[#77DFF8] text-xl lg:text-4xl">{enemyScore}</p>
            </div>

            <div className="flex items-center">
                {playerTwo && (
                    <>
                        <div className="flex flex-row">
                            <div className="badge badge-neutral text-white bg-[#fb4848]">enemy</div>
                            <p className="text-lg md:text-lg font-bold ml-3 ">{playerTwo.username}</p>
                        </div>
                        <Image
                            src={playerOne?.profile?.avatar ?? "/placeholderuser.jpeg"}
                            alt="User Avatar"
                            width={18}
                            height={18}
                            className="w-full mask mask-squircle h-full object-cover rounded-full ml-2 lg:w-16 lg:h-16"
                        />
                    </>
                )}
            </div>
        </div>
    );
}