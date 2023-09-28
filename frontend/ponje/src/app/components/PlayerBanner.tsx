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
                    <FontAwesomeIcon icon={faUserPlus} className="mr-2" style={{ fontSize: "0.8em" }} />
                    Add Friend
                </button>
            </div>
        </div>
    );
};
