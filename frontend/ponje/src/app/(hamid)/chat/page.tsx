'use client';

import { User } from "@nextui-org/react";
import ChatInput from './components/chatInput';



export default function Chat() {
    return (
        <div className="bg-[#151424] h-[100vh] p-0">
            <div className="bg-[#1B1A2D] w-full sticky top-0">
                <User className="text-white my-2 p-6"
                    name="hamid"
                    description="last message"
                    avatarProps={{
                        src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
                    }}
                />
            </div>

            <ChatInput />
        </div>
    )
}

