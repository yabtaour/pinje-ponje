'use client'

import useSocket from "@/app/hooks/useSocket";
import moment from 'moment';
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../layout";

export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}


const formatMessageDate = (createdAt: any) => {
    const messageDate = moment(createdAt);
    const currentDate = moment();

    if (messageDate.isSame(currentDate, 'day')) {
        return messageDate.format('LT');
    } else if (messageDate.isSame(currentDate.clone().subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    } else {
        return messageDate.format('MMM DD, YYYY');
    }
};


export default function Conversation({ collapsed }: any) {
    const [conversations, setConversations] = useState<any[]>([] as any[]);
    const socket = useSocket();
    const { activeConversation, setActiveConversation } = useContext(ChatContext);


    useEffect(() => {

        console.log("connecting to socket");
        // socket.chatSocket?.connect();
        socket.chatSocket?.on('connect', () => {
            console.log('connected');
        });
        return () => {
            socket.chatSocket?.disconnect();
        };
    }, [socket.chatSocket]);

    useEffect(() => {

        console.log("chatSocket: ", socket.chatSocket);
        socket.chatSocket?.emit('getRooms', {
            skip: 0,
            take: 10,
        });

        socket.chatSocket?.on('listOfRooms', (res: any) => {
            console.log("res: ", res);
            setConversations(res);
        })

        return () => {
            socket.chatSocket?.disconnect();
        };
    }, [socket.chatSocket]);

    return (
        <div className="w-full p-0">
            <div className="w-full p-0">
                {
                    // conversations.length === 0 ? (<Loader />) : (
                    <>
                        {
                            conversations.map((conversation: any) => (
                                <button onClick={() => {
                                    // TODO : it should be just the id but rsaf has another idea

                                    console.log("conversation: ", conversation);
                                    setActiveConversation(conversation);
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
                                            <div >
                                                <h2 className="mb-1 p-0">
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
                                                <p className="text-gray-400 ml-3 text-xs font-light">
                                                    {
                                                        collapsed ? "" : (

                                                            conversation?.messages?.[0]?.content.length > 10
                                                                ? conversation?.messages?.[0]?.content.slice(0, 10) + "..."
                                                                : conversation?.messages?.[0]?.content
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
                    // )
                }
            </div>
        </div>

    )
}
