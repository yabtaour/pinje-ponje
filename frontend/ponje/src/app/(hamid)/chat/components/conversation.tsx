'use strict'
'use client'



import { addMessage, setActiveConversation } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import SocketManager from "@/app/utils/socketManager";
import { Button, useDisclosure } from "@nextui-org/react";
import moment from 'moment';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import CreateConversation from "./createConversation";

export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}


export const formatMessageDate = (createdAt: any) => {
    const messageDate = moment(createdAt);
    const formattedDate = messageDate.format('LT');
    return formattedDate;

    // const messageDate = moment(createdAt);
    // const today = moment().startOf('day');
    // const yesterday = moment().subtract(1, 'day').startOf('day');

    // if (messageDate.isSame(today, 'day')) {
    //     return messageDate.format('LT');
    // } else if (messageDate.isSame(yesterday, 'day')) {
    //     return 'Yesterday';
    // } else {
    //     return messageDate.format('MMM DD');
    // }
};



export default function Conversation({ collapsed }: any) {

    const conversations = useAppSelector(state => state?.chatReducer?.rooms);
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const dispatch = useDispatch();
    const socketManager = SocketManager.getInstance();



    useEffect(() => {
        const fetchNewMessages = async () => {
            try {
                const newMessage = await socketManager.getNewMessages();
                console.log("newMessage: ", newMessage);
                console.log(conversations);
                dispatch(addMessage(newMessage));
            } catch (error) {
                console.error("Error fetching new messages:", error);
            }
        };

        fetchNewMessages();

    }, [socketManager, conversations]);


    return (
        <div className=" p-1">
            <div className=" ">
                {
                    <>
                        <div className="flex justify-between ">
                            <h1 className="text-white text-3xl">Inbox</h1>

                            <Button onPress={onOpen} className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h6m0 0h6m-6 0v6m0-6V6" />
                                </svg>
                            </Button>
                            <CreateConversation isOpen={isOpen} onOpenChange={onOpenChange} />
                        </div>
                        {
                            conversations?.map((conversation: any) => (
                                <button onClick={() => {
                                    // TODO : it should be just the id but rsaf has another idea

                                    console.log("conversation: ", conversation);
                                    dispatch(setActiveConversation(conversation));
                                    // setActiveConversation(conversation);
                                }} className={`sticky w-full p-2 m-1 top-0 rounded-full ${activeConversationId === conversation?.id ? 'bg-[#252341]' : 'hover:bg-[#252341]'
                                    }`} key={conversation.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-start ">

                                            {
                                                conversation?.roomType
                                                    !== "DM" ? (
                                                    <img
                                                        src="https://i.redd.it/ow1iazp3ob351.jpg"
                                                        alt="avatar"
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                ) : (
                                                    <img
                                                        src={`${conversation?.members[0]?.user?.profile?.avatar}`}
                                                        alt="avatar"
                                                        className="w-12 h-12 rounded-full"
                                                    />
                                                )
                                            }
                                            <div className="flex justify-start flex-row">
                                                <h2 className=" p-0">
                                                    {
                                                        conversation?.roomType !== "DM" ? (
                                                            <p className="text-white text-sm font-semibold">
                                                                {collapsed ? "" : conversation?.name}
                                                            </p>
                                                        ) : (
                                                            <p className="text-white text-sm font-semibold">
                                                                {collapsed ? "" : conversation?.members[0]?.user?.username}
                                                            </p>
                                                        )
                                                    }
                                                </h2>

                                                <p className="text-gray-400 mt-5 ml-3 text-xs font-light">
                                                    {
                                                        collapsed ? "" : (
                                                            conversation?.room?.messages?.slice(-1)[0]?.content?.length > 10
                                                                ? conversation?.room?.messages?.slice(-1)[0]?.content.slice(0, 10) + "..."
                                                                : conversation?.room?.messages?.slice(-1)[0]?.content
                                                        )
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-gray-400 text-xs ml-70 font-light">
                                            {
                                                collapsed ? "" : (
                                                    formatMessageDate(conversation?.messages?.[0]?.createdAt)
                                                )
                                            }
                                        </div>
                                    </div>
                                </button>
                            ))
                        }
                    </>
                }
            </div>
        </div>

    )
}

