'use client';

import { useSocketIO } from "@/app/contexts/socketContext";
import { addMessage } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";


import { Input } from "@nextui-org/react";
import { useState } from "react";
import { useDispatch } from "react-redux";



export default function ChatInput() {

    const { chatSocket } = useSocketIO()

    const newMessage =
    {
        id: 389,
        content: 'd',
        roomId: 1,
        userId: 131,
        createdAt: 'now'
    }


    const dispatch = useDispatch();
    const [value, setValue] = useState("")

    const activeConversation = useAppSelector(state => state?.chatReducer?.activeConversation);
    const me = useAppSelector(state => state?.authReducer?.value?.user);


    const handleSend = () => {
        chatSocket?.emit('sendMessage', {
            message: value,
            id: activeConversation?.room?.id
        });
    };


    const handleOnClick = () => {
        if (value.trim() !== '') {
            console.log('Sending message:', value);
            //append message to messages
            dispatch(addMessage({
                id: 9000,
                content: value,
                roomId: activeConversation?.room?.id,
                userId: me?.id,
                createdAt: 'now'
            }));
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