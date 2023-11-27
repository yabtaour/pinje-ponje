'use client';

import { useAppSelector } from "@/app/globalRedux/store";
import useSocket from "@/app/hooks/useSocket";
import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function ChatInput() {

    const [value, setValue] = useState("")
    const globalSocket = useSocket();
    const activeConversation = useAppSelector(state => state?.chatReducer?.activeConversation);

    const handleSend = () => {
        globalSocket.chatSocket?.emit('sendMessage', {
            message: value,
            id: activeConversation?.room?.id
        });
    };


    const handleOnClick = () => {
        if (value.trim() !== '') {
            console.log('Sending message:', value);
            handleSend();
            setValue('');
        }
    }



    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (value.trim() !== '') {
                console.log('Sending message:', value);
                handleSend();
                setValue('');
            }
        }
    };










    return (
        <div className="bg-[#151424] w-[80%] flex justify-center absolute  p-10" style={{
            bottom: 0,
            color: '#817EC4'
        }}>
            <Input

                type="text"

                placeholder="Type a message"
                className="bg-[#1B1A2D] text-white w-[100%]"
                radius={'md'}
                value={value}
                onValueChange={setValue}
                onKeyDown={handleKeyDown}
                onChange={(e) => setValue(e.target.value)}
                endContent={
                    <button onClick={handleOnClick}
                        className="bg-[#1B1A2D] rounded-full p-2 hover:bg-[#817EC4]">
                        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M3 20V4l19 8l-19 8Zm2-3l11.85-5L5 7v3.5l6 1.5l-6 1.5V17Zm0 0V7v10Z" />
                        </svg>
                    </button>
                }
            />
        </div>
    );
}