'use client';

import { addMessage, replaceMessage } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import SocketManager from "@/app/utils/socketManager";
import { useToast } from "@chakra-ui/react";
import { Input } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { miyagi } from 'ldrs';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";


if (typeof window !== 'undefined') {
    miyagi.register()
}



const spinner = <svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
        <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
    </path>
</svg>

const generateUniqueId = (flag = '_') => flag + Math.random().toString(36).substr(2, 9);

export default function ChatInput() {
    const dispatch = useDispatch();
    const [value, setValue] = useState("")
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const rooms = useAppSelector(state => state?.chatReducer?.rooms);
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    const accessToken = getCookie('token');
    const socketManager = SocketManager.getInstance(`${process.env.NEXT_PUBLIC_API_URL}`, accessToken);
    const toast = useToast();
    useEffect(() => {

    }, [dispatch, activeConversation, socketManager, rooms, activeConversation?.state]);


    const handleSend = async () => {
        if (activeConversation?.room?.id) {
            const messageId = generateUniqueId('_new_message__');



            const draftNewMessage = (status: any) => ({
                id: messageId,
                roomId: activeConversation?.room?.id,
                user: me,
                content: value,
                createdAt: new Date(),
                status
            })

            const draftmessage = draftNewMessage('pending');
            dispatch(addMessage(draftmessage))

            setValue('');

            try {
                socketManager.waitForConnection(async () => {
                    const newMessage = await socketManager.sendMessage(value, activeConversation?.room?.id);
                    // const foundIndex = activeConversation?.room?.messages.findIndex((message: any) => message.id === messageId);
                    dispatch(replaceMessage(newMessage))
                });


            } catch (error) {
                const err = error as AxiosError;
                toast({
                    title: 'Error',
                    description: `Error sending message : ${err.message}`,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
                console.error("Error sending message:", error);
            }
        }
    };


    const handleOnClick = () => {
        if (value.trim() !== '') {
            handleSend();
            setValue('');
        }
    }


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (value.trim() !== '') {
                handleSend();
                setValue('');
            }
        }
    };

    return (
        <div className="bg-[#151424] w-[80%] flex justify-center absolute p-10" style={{ bottom: 0, color: '#817EC4', opacity: activeConversation?.state === 'MUTED' ? 0.5 : 1 }}>
            <Input
                type="text"
                placeholder={activeConversation?.state === 'MUTED' ? 'You are muted' : 'Type a message'}
                className={`bg-[#1B1A2D] text-white w-[100%] ${activeConversation?.state === 'MUTED' ? 'cursor-not-allowed' : ''}`}
                radius={'md'}
                value={value}
                onValueChange={setValue}
                onKeyDown={handleKeyDown}
                disabled={activeConversation?.state === 'MUTED'}
                onChange={(e) => setValue(e.target.value)}
                style={{ pointerEvents: activeConversation?.state === 'MUTED' ? 'none' : 'auto' }}
                endContent={

                    <>
                        <button
                            onClick={handleOnClick}
                            className={`bg-[#1B1A2D] rounded-full p-2 hover:bg-[#817EC4] ${activeConversation?.state === 'MUTED' ? 'cursor-not-allowed' : ''}`}
                            disabled={activeConversation?.state === 'MUTED'}
                            style={{ pointerEvents: activeConversation?.state === 'MUTED' ? 'none' : 'auto' }}
                        >
                            <div className="flex items-center space-x-2">
                                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="currentColor" d="M3 20V4l19 8l-19 8Zm2-3l11.85-5L5 7v3.5l6 1.5l-6 1.5V17Zm0 0V7v10Z" />
                                </svg>
                            </div>
                        </button>
                    </>

                }
            />
        </div>);

}