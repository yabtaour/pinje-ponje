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
import { fetchUserData, getToken } from '../../../utils/auth';
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
    const [me, setMe] = useState(null) as any;
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && conversations.length === 0) {
                setLoading(false);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [isLoading, conversations.length]);


    const handleNewMessageAsync = async () => {
        const rooms = await socketManager.getConversations();
        dispatch(setRooms(rooms));
    };





    const handleNewActions = async (memberShip: any) => {
        handleNewMessageAsync();

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
                    const newMessage = socketManager.sendMessage(draftMessage.content, activeConversation.roomId, 'INFORMATION');
                    dispatch(replaceMessage(newMessage))
                }

            } catch (error) {
                toast({
                    title: 'Error',
                    description: "Error sending message",
                    status: 'error',
                    duration: 1000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
                console.error("Error sending message:", error);
            }
        }

        if (activeConversationId === memberShip?.roomId) {
            dispatch(setActiveConversation(memberShip));
        }
    };


    useEffect(() => {

        const getMe = async () => {
            let token = getToken();
            if (token) {
                fetchUserData(token).then((ret) => {
                    setMe(ret);
                }).catch(() => {
                    console.log('error fetching me ');
                })
            }
        }

        const fetchNewMessages = async () => {
            try {
                console.log('fetching new messages');
                if (!socketManager.getMainSocket()?.connected) {
                    console.log('socket not connected');
                    socketManager.getMainSocket()?.connect();
                }
                socketManager.waitForConnection(async () => {
                    console.log('socket connected');

                    socketManager.getNewMessages(handleNewMessageAsync);
                    const rooms = await socketManager.getConversations();
                    console.log('rooms: ', rooms);
                    dispatch(setRooms(rooms));
                })
            } catch (error) {
                setLoading(false);
                console.error("Error fetching new messages:", error);
            }
        };

        getMe();
        fetchNewMessages();
    }, []);


    useEffect(() => {



        const handleMemberStateChanges = async () => {
            try {
                console.log('fetching new messages');
                socketManager.waitForConnection(async () => {
                    socketManager.listenOnUpdates(handleNewActions);

                })
            } catch (error) {
                console.error("Error:", error);
            }
        }
        handleMemberStateChanges();
    }, [conversations, dispatch, socketManager]);


    return (
        <div className="overflow-x-hidden">
            <div className="md:flex w-full justify-between flex-wrap">
                <div className="flex items-center justify-between">
                    <h1 className="text-white text-3xl hidden md:block ml-4 mr-[135px]">Inbox</h1>
                    <Button onPress={onOpen} className="hover:bg-blue-300/10 text-white font-bold py-1 px-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke-width="1">
                            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                        </svg>
                    </Button>
                </div>


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
                    }} className={`sticky w-full p-2 m-1 top-0 ${activeConversationId === conversation?.id ? 'bg-[#252341]' : 'hover:bg-[#252341]'}`} key={conversation.id}>
                        <div className="flex justify-between">
                            <div className="flex items-start ">
                                {conversation?.room?.roomType !== "DM" ? (
                                    <Image
                                        src="/gc_icon.png"
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                ) : (
                                    <Image
                                        src={`${conversation?.room?.members?.find((member: any) => member?.userId !== me?.id)?.user?.profile?.avatar ? conversation?.room?.members?.find((member: any) => member?.userId !== me?.id)?.user?.profile?.avatar : "/defaultAvatar.png"}`}
                                        alt="avatar"
                                        className="w-12 h-12 rounded-full"
                                    />
                                )}
                                <div className="flex justify-end align-start flex-col">
                                    <h2 className=" p-0">
                                        {conversation?.room?.roomType !== "DM" ? (
                                            <p className=" px-2 text-sm font-semibold text-[#77DFF8]">
                                                {collapsed ? "" : conversation?.room?.name}
                                            </p>
                                        ) : (
                                            <p className="text-white px-2 text-left text-sm font-semibold">
                                                {collapsed ? "" : conversation?.room?.members?.find((member: any) => member?.userId !== me?.id)?.user?.username}
                                            </p>
                                        )}
                                    </h2>
                                    <p className={`text-xs mt-1.5 mr-[75px] font-light ${!conversation?.read ? 'text-[#3574FF]' : 'text-gray-400'}`}>
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

