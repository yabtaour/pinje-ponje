import React from "react";
import Image from "next/image";

export const PlayerBanner = () => {
  return (
    <div className="relative">
      <Image
        src="/PlayerBanner.png"
        alt="banner image"
        width={1920}
        height={400}
      />
      <Image
        src="/TestUserImage.png"
        alt="user image"
        width={80}
        height={80}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
      <p className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
        This is some text under the user image
      </p>
    </div>
  );
};
