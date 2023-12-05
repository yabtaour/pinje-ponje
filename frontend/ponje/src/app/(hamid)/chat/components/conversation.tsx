'use strict'
'use client'



import { setActiveConversation, setRooms } from "@/app/globalRedux/features/chatSlice";
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
                const rooms = await socketManager.getConversations();
                console.log("rooms: ", rooms);
                dispatch(setRooms(rooms));
            } catch (error) {
                console.error("Error fetching new messages:", error);
            }
        };

        fetchNewMessages();

        console.log("conversations: ", conversations.map((conversation: any) => conversation));

    }, [socketManager, conversations, dispatch, activeConversationId]);


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

                            conversations
                                ?.filter(conversation => conversation?.room?.messages?.length > 0) // Filter conversations with messages
                                .sort((a: any, b: any) => {
                                    const lastMessageA = a.room?.messages?.[a.room?.messages?.length - 1]?.createdAt;
                                    const lastMessageB = b.room?.messages?.[b.room?.messages?.length - 1]?.createdAt;

                                    if (lastMessageA && lastMessageB) {
                                        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
                                    }
                                    return 0;
                                })?.map((conversation: any) => (
                                    <button onClick={() => {
                                        console.log("conversation: ", conversation);
                                        socketManager.makeConversationRead(conversation?.roomId);
                                        // dispatch(setRooms(socketManager.getConversations()));
                                        dispatch(setActiveConversation(conversation));

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

                                                    {/* <p className="text-gray-400 mt-5 ml-3 text-xs font-light  "> */}
                                                    <p className={`text-gray-400 mt-5 ml-3 text-xs font-light ${conversation?.read === false ? 'text-[#3574FF]' : ''}`}>
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
        // <div className=" flex justify-center   sticky top-0">
        //     <div className="lg:w-1/3 md:2/3 bg-[#1B1A2D] sm:w-full text-white  rounded-b-full hover:bg-[#252341] flex justify-center ">
        //         <Button onPress={onOpen} >
        //             open 
        //             {/* <User
        //                 className="text-white my-2 p-4"
        //                 name={activeConversation?.room?.roomType !== "DM" ? activeConversation?.room?.name : activeConversation?.room?.members[0]?.user?.username}
        //                 avatarProps={
        //                     activeConversation?.room?.roomType !== "DM"
        //                         ?
        //                         { src: activeConversation?.room?.members[0]?.user?.profile?.avatar }
        //                         :
        //                         { src: "https://i.redd.it/ow1iazp3ob351.jpg" }
        //                 }
        //             /> */}
        //         </Button>
        //         <RoomOptions isOpen={isOpen} onOpenChange={onOpenChange} />
        //     </div>
        // </div>

    )
}

