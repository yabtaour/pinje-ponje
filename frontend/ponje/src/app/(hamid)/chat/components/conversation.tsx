'use strict'
'use client'



import { addMessage, replaceMessage, setActiveConversation, setRooms } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import SocketManager from "@/app/utils/socketManager";
import { Toast, useToast } from "@chakra-ui/react";
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
                //handle new messages, mutes , bans, kicks , and invites
                const newMessage = await socketManager.getNewMessages();
                const rooms = await socketManager.getConversations();
                // setLoading(false);
                dispatch(setRooms(rooms));
            } catch (error) {
                setLoading(false);
                Toast({
                    title: 'Error fetching new messages',
                    description: `${error}`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                })
                console.error("Error fetching new messages:", error);
            }
        };

        fetchNewMessages();
    }, [conversations]);


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
                console.error("Error:", error);
            }
        }


        handleMemberStateChanges();

    }, [activeConversation, socketManager, conversations]);


    return (
        <div className=" p-1">
            <div className=" ">
                <>
                    <div className="flex justify-between ">
                        <h1 className="text-white text-3xl">Inbox</h1>
                        <Button onPress={onOpen} className="hover:bg-blue-300/10  text-white font-bold py-2 px-4 rounded-full border border-blue-700">
                            <Image
                                alt="hamid"
                                className=""
                                height={24}
                                src="/groups.svg"
                                width={24}
                            />
                        </Button>
                        <CreateConversation isOpen={isOpen} onOpenChange={onOpenChange} />
                    </div>
                    {isLoading && conversations.length === 0 ? (
                        <div className="flex justify-center">
                            <HashLoader size={100} color="#2F296E" />
                        </div>
                    ) : !isLoading && conversations.length === 0 ? (
                        <div className='text-gray-500 flex flex-col items-center
                        '>
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
                                            <img
                                                src="/groups.svg"
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full"
                                            />
                                        ) : (
                                            <img
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
                                                        {collapsed ? "" : conversation?.room?.members?.[0]?.user?.username}
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
                </>
            </div>
        </div>
    )

}

