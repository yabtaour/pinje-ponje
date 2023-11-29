'use client'



import { useSocketIO } from "@/app/contexts/socketContext";
import { setActiveConversation, setRooms } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import { Button, useDisclosure } from "@nextui-org/react";
import { getCookie } from "cookies-next";
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
    const activeConversation = useAppSelector(state => state?.chatReducer?.activeConversation);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const dispatch = useDispatch();
    const { chatSocket } = useSocketIO();

    const token = getCookie("token");



    useEffect(() => {
        if (!chatSocket?.connected) chatSocket?.connect();
        console.log("from conversation: ", chatSocket);
        chatSocket?.on("connect", () => {
            console.log("socket connected", chatSocket);
            chatSocket?.emit("getRooms", (rooms: any) => {
                console.log("rooms: ", rooms);
                if (conversations.length === 0)
                    dispatch(setRooms(rooms));
                // setConversations(rooms);

            });





        });

        // if (newChatSocket) {
        //     return () => {
        //         newChatSocket?.disconnect();
        //     };
        // }
    }, [chatSocket, conversations]);




    // newChatSocket?.on('connect', () => {

    //     console.log("socket connected", newChatSocket);

    useEffect(() => {
        if (!chatSocket?.connected) chatSocket?.connect();
      
        chatSocket?.on('connect', () => {
          console.log('Socket connected');
          chatSocket?.on('message', (message) => {
            console.log('Received message:', message);
            // Handle the received message logic here...
          });
        });
      
        return () => {
          chatSocket?.off('message'); // Clean up the listener when component unmounts
        };
      }, [chatSocket]);

    // })

    // console.log("has event listteners: ", newChatSocket?.hasListeners('message'));
    // newChatSocket?.on('disconnect', () => {
    //     console.log("socket disconnected");
    // });


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
                                }} className={`sticky w-full p-2 m-1 top-0 rounded-full ${activeConversation?.id === conversation?.id ? 'bg-[#252341]' : 'hover:bg-[#252341]'
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
