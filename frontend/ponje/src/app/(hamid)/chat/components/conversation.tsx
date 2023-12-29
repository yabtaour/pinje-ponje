'use strict'
'use client'



import { addMessage, replaceMessage, setActiveConversation, setRooms } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import SocketManager from "@/app/utils/socketManager";
import { useToast } from "@chakra-ui/react";
import { Button, Image, useDisclosure } from '@nextui-org/react';
import moment from 'moment';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HashLoader } from "react-spinners";
import CreateConversation from "./roomOptions";

export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}


export const formatMessageDate = (createdAt: any) => {
    // const messageDate = moment(createdAt);
    // const formattedDate = messageDate.format('LT');
    // return formattedDate;

    const messageDate = moment(createdAt);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    if (messageDate.isSame(today, 'day')) {
        return messageDate.format('LT');
    } else if (messageDate.isSame(yesterday, 'day')) {
        return 'Yesterday';
    } else {
        return messageDate.format('MMM DD');
    }
};



export default function Conversation({ collapsed }: any) {

    const conversations = useAppSelector(state => state?.chatReducer?.rooms);
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const dispatch = useDispatch();
    const socketManager = SocketManager.getInstance();
    const toast = useToast()
    const [isLoading, setLoading] = useState(true);
    const [messageDispatched, setMessageDispatched] = useState(false);


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && conversations.length === 0) {
                setLoading(false);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [isLoading, conversations.length]);


    useEffect(() => {
        const fetchNewMessages = async () => {
            try {
                await socketManager.getNewMessages();
                const rooms = await socketManager.getConversations();
                dispatch(setRooms(rooms));
            } catch (error) {
                setLoading(false);
                console.error("Error fetching new messages:", error);
            }
        };

        fetchNewMessages();
    }, [conversations, dispatch, socketManager]);


    useEffect(() => {
        const handleActions = (memberShip: any) => {
            const { state } = memberShip;

            if ((state === "BANNED" || state === "MUTED" || state === "KICKED" || state === "ACTIVE")) {

                const generateUniqueId = (flag = '_') => flag + Math.random().toString(36).substr(2, 9);

                const messageId = generateUniqueId('_new_message__');
                const draftNewMessage = (status: any) => ({
                    id: messageId,
                    roomId: activeConversation?.roomId,
                    user: null,
                    content: activeConversation?.userId === memberShip?.userId ? `you have been ${state}` : `${memberShip?.user?.username} has been ${state}`,
                    createdAt: new Date(),
                    state: 'INFORMATION'
                });

                const draftMessage = draftNewMessage('INFORMATION');

                dispatch(addMessage(draftMessage));
                try {
                    if (activeConversation) {
                        socketManager.sendMessage(draftMessage.content, activeConversation.roomId, 'INFORMATION');
                        dispatch(replaceMessage(draftMessage))
                    }

                } catch (error) {
                    toast({
                        title: 'Error',
                        description: "Error sending message",
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


        const handleMemberStateChanges = async () => {
            try {
                const memberShip = await socketManager.listenOnUpdates();

                if (memberShip?.id === activeConversation?.id) {
                    dispatch(setActiveConversation(memberShip));
                }

                handleActions(memberShip);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: "Member state change error",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
                console.error("Error:", error);
            }
        }


        handleMemberStateChanges();

    }, [activeConversation, socketManager, conversations, dispatch]);


    return (
        <div className="overflow-x-hidden">
            <div className="flex w-full justify-between ">
                <h1 className="text-white text-3xl">Inbox</h1>
                <Button onPress={onOpen} className="hover:bg-blue-300/10  text-white font-bold py-2 px-4 rounded-full border border-blue-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="76" height="77" viewBox="0 0 76 77" fill="none" className="w-6 h-6">
                        <path d="M22.4 76.4C20 76.4 18.4 74.8 18.4 72.4V58H8C3.6 58 0 54.4 0 50V8C0 3.6 3.6 0 8 0H68C72.4 0 76 3.6 76 8V50C76 54.4 72.4 58 68 58H48L24.4 75.6C24 76 23.2 76.4 22.4 76.4ZM22.4 72.4L46.8 54H68C70.4 54 72 52.4 72 50V8C72 5.6 70.4 4 68 4H8C5.6 4 4 5.6 4 8V50C4 52.4 5.6 54 8 54H22.4V72.4Z" fill="#77DFF8" />
                        <path d="M38 28.4C34.8 28.4 32 25.6 32 22.4C32 19.2 34.8 16 38 16C41.2 16 44 18.8 44 22C44 25.2 41.2 28.4 38 28.4ZM38 20C36.8 20 36 21.2 36 22C36 23.2 36.8 24 38 24C39.2 24 40 23.2 40 22C40 21.2 39.2 20 38 20Z" fill="#77DFF8" />
                        <path d="M49.1996 44.4016H27.5996C26.3996 44.4016 25.5996 43.6016 25.5996 42.4016C25.5996 35.2016 31.1996 29.6016 38.3996 29.6016C45.5996 29.6016 51.1996 35.2016 51.1996 42.4016C51.1996 43.6016 50.3996 44.4016 49.1996 44.4016ZM29.5996 40.4016H46.7996C45.9996 36.4016 42.3996 33.6016 37.9996 33.6016C33.5996 33.6016 30.7996 36.4016 29.5996 40.4016Z" fill="#77DFF8" />
                        <path d="M22.4 40.0016H8C6.8 40.0016 6 39.2016 6 38.0016C6 31.2016 11.6 25.6016 18.4 25.6016C21.6 25.6016 24.4 26.8016 26.8 28.8016C27.6 29.6016 27.6 30.8016 26.8 31.6016C26 32.4016 24.8 32.4016 24 31.6016C22.4 30.0016 20.4 29.2016 18.4 29.2016C14.4 29.2016 11.2 32.0016 10.4 35.6016H22.4C23.6 35.6016 24.4 36.4016 24.4 37.6016C24.4 38.8016 23.2 40.0016 22.4 40.0016Z" fill="#77DFF8" />
                        <path d="M17.6002 24.8C14.0002 24.8 11.2002 22 11.2002 18.4C11.2002 14.8 14.0002 12 17.6002 12C21.2002 12 24.0002 14.8 24.0002 18.4C24.0002 22 20.8002 24.8 17.6002 24.8ZM17.6002 16C16.0002 16 15.2002 17.2 15.2002 18.4C15.2002 19.6 16.0002 20.8 17.6002 20.8C18.8002 20.8 20.0002 19.6 20.0002 18.4C20.0002 17.2 18.8002 16 17.6002 16Z" fill="#77DFF8" />
                        <path d="M69.1998 40H54.7998C53.5998 40 52.7998 39.2 52.7998 38C52.7998 36.8 53.5998 36 54.7998 36H66.7998C65.9998 32.4 62.7998 29.6 58.7998 29.6C56.7998 29.6 54.7998 30.4 53.1998 32C52.3998 32.8 51.1998 32.8 50.3998 32C49.5998 31.2 49.5998 30 50.3998 29.2C52.7998 27.2 55.5998 26 58.7998 26C65.5998 26 71.1998 31.6 71.1998 38.4C71.1998 39.2 69.9998 40 69.1998 40Z" fill="#77DFF8" />
                        <path d="M57.9996 24.8C54.3996 24.8 51.5996 22 51.5996 18.4C51.5996 14.8 54.7996 12 57.9996 12C61.1996 12 64.3996 14.8 64.3996 18.4C64.3996 22 61.5996 24.8 57.9996 24.8ZM57.9996 16C56.7996 16 55.5996 17.2 55.5996 18.4C55.5996 19.6 56.7996 20.8 57.9996 20.8C59.1996 20.8 60.3996 19.6 60.3996 18.4C60.3996 17.2 59.5996 16 57.9996 16Z" fill="#77DFF8" />
                    </svg>
                </Button>
                <CreateConversation isOpen={isOpen} onOpenChange={onOpenChange} />
            </div>
            {isLoading && conversations.length === 0 ? (
                <div className="flex justify-center">
                    <HashLoader size={100} color="#2F296E" />
                </div>
            ) : !isLoading && conversations.length === 0 ? (
                <div className='text-gray-500 flex flex-col items-center'>
                    <Image
                        className='my-10'
                        width={150}
                        alt="NextUI hero Image"
                        src="noData.svg"
                    />
                    <h1>NO Room UWU</h1>
                </div>
            ) : conversations
                ?.slice()
                ?.sort((a, b) => {
                    const lastMessageA = a.room?.messages?.[a.room?.messages?.length - 1]?.createdAt || a.room?.createdAt;
                    const lastMessageB = b.room?.messages?.[b.room?.messages?.length - 1]?.createdAt || b.room?.createdAt;

                    if (lastMessageA && lastMessageB) {
                        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
                    } else if (!lastMessageA && !lastMessageB) {
                        return new Date(b.room?.createdAt).getTime() - new Date(a.room?.createdAt).getTime();
                    } else {
                        return lastMessageB ? 1 : -1;
                    }
                })
                ?.map((conversation: any) => (
                    <button onClick={() => {
                        socketManager.makeConversationRead(conversation?.roomId);
                        dispatch(setActiveConversation(conversation));
                    }} className={`sticky w-full p-2 m-1 top-0 rounded-full ${activeConversationId === conversation?.id ? 'bg-[#252341]' : 'hover:bg-[#252341]'}`} key={conversation.id}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-start ">
                                {conversation?.room?.roomType !== "DM" ? (
                                    <Image
                                        src="/groups.svg"
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <Image
                                        src={`${conversation?.members?.[0]?.user?.profile?.avatar ? conversation?.members?.[0]?.user?.profile?.avatar : "/defaultAvatar.png"}`}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div className="flex justify-end align-start flex-col">
                                    <h2 className=" p-0">
                                        {conversation?.room?.roomType !== "DM" ? (
                                            <p className="text-white px-2 text-sm font-semibold">
                                                {collapsed ? "" : conversation?.room?.name}
                                            </p>
                                        ) : (
                                            <p className="text-white px-2 text-left text-sm font-semibold">
                                                {collapsed ? "" : conversation?.room?.members?.find((member: any) => member?.userId !== activeConversation?.userId)?.user?.username}
                                            </p>
                                        )}
                                    </h2>
                                    <p className={`  ml-3 text-xs font-light ${!conversation?.read ? 'text-[#3574FF]' : 'text-gray-400'}`}>
                                        {collapsed ? "" : (
                                            conversation?.room?.messages?.slice(-1)[0]?.content?.length > 15
                                                ? conversation?.room?.messages?.slice(-1)[0]?.content.slice(0, 15) + "..."
                                                : conversation?.room?.messages?.slice(-1)[0]?.content
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="text-gray-400 text-xs ml-70 font-light">
                                {collapsed ? "" : (
                                    formatMessageDate(conversation?.messages?.[0]?.createdAt)
                                )}
                            </div>
                        </div>
                    </button>
                ))
            }
        </div>
    )

}

