import { User as NextUIUser } from "@nextui-org/react";


export const CustomUser = ({ username, description, avatarSrc } : { username: string, description: string, avatarSrc: string }) => (
  <div className="flex items-center flex-col">
    <div className="mr-2">
      <NextUIUser
        name={username}
        className="text-white my-1 px-4"
        avatarProps={{
          src: avatarSrc ?? "/defaultAvatar.png",
        }}
      />
    </div>
    <div>
      {/* <p className="text-gray-400 text-xs ml-10">{description}</p> */}
    </div>
  </div>
);
