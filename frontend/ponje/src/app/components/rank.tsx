'use client';

import Image from "next/image";


export default function Rank({ rank }: { rank: string }) {
    return (
        <div className="flex justify-center">

            {
                rank ? (
                    <Image
                        src={`/ranks/${rank}.svg`}
                        alt="user image"
                        width={32}
                        height={32}
                        className="w-[100px] h-[100px] mx-auto m-10 md:mb-0 rounded"
                    />

                ) : (
                    <h1>Unrated</h1>
                )
            }
        </div>
    )
}