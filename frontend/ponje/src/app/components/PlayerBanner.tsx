import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

export const PlayerBanner = () => {
    return (
        <div className="relative">
            <Image
                src="/PlayerBanner.png"
                alt="banner image"
                width={1920}
                height={400}
            />
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center w-full">
                <Image
                    src="/TestUserImage.png"
                    alt="user image"
                    width={80}
                    height={80}
                    className="mx-auto"
                />
                <p className="font-medium text-[#77DFF8]">ssabbaji</p>
                <p className="font-light text-sm text-[#8C8CDA]">
                    soukaina | Joined Sept 28 2023
                </p>
                <button className="btn btn-sm btn-active btn-primary mt-4">
                    <svg width="25" height="15" viewBox="0 0 327 239" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M105.966 116.576C138.157 116.576 164.254 90.4796 164.254 58.2881C164.254 26.0965 138.157 0 105.966 0C73.7744 0 47.6779 26.0965 47.6779 58.2881C47.6779 90.4796 73.7744 116.576 105.966 116.576Z" fill="white" />
                        <path d="M105.968 145.72C47.5631 145.72 0 184.889 0 233.152C0 236.416 2.56467 238.981 5.82881 238.981H206.107C209.371 238.981 211.936 236.416 211.936 233.152C211.936 184.889 164.373 145.72 105.968 145.72Z" fill="white" />
                        <path d="M320.056 69.4446H208.944C205.148 69.4446 202 66.2964 202 62.5001C202 58.7038 205.148 55.5557 208.944 55.5557H320.056C323.852 55.5557 327 58.7038 327 62.5001C327 66.2964 323.852 69.4446 320.056 69.4446Z" fill="white" />
                        <path d="M264.5 125C260.704 125 257.556 121.852 257.556 118.056V6.94444C257.556 3.14815 260.704 0 264.5 0C268.296 0 271.444 3.14815 271.444 6.94444V118.056C271.444 121.852 268.296 125 264.5 125Z" fill="white" />
                    </svg>
                    Add friend
                </button>

            </div>
        </div>
    );
};
