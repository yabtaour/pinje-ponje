'use client';
import { useAppSelector } from "@/app/globalRedux/store";
import useSocket from "@/app/hooks/useSocket";
import { User } from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import ChatInput from "./components/chatInput";
import { ChatContext } from "./layout";



export default function Chat() {
    const [messages, setMessages] = useState([]) as any[]
    const token = useAppSelector(state => state?.authReducer?.value?.token)?.replace('Bearer ', '');
    const socket = useSocket();
    const { activeConversation, setActiveConversation } = useContext(ChatContext);

    useEffect(() => {
        console.log("from Chat: ", activeConversation);
    }, [activeConversation?.id]);


    // useEffect(() => {
    //     console.log("connecting to socket");
    //     socket.chatSocket?.on('connect', () => {
    //         console.log('connected');
    //     });
    //     return () => {
    //         socket.chatSocket?.disconnect();
    //     };
    // }, []);




    useEffect(() => {
        console.log("activeConversation: ", activeConversation);
        // if (activeConversation) {
        socket.chatSocket?.emit('getMessages', {
            id: activeConversation?.room?.id,
        });

        socket.chatSocket?.on('listOfMessages', (message: any) => {
            console.log("newMessage: ", message);
            setMessages((messages: any) => [...messages, message]);
        });
        // }

    }, [activeConversation?.id])


    return (
        <div className="bg-[#151424] h-full w-full  p-0">
            <div className="bg-[#1B1A2D] w-full sticky top-0">
                <User className="text-white my-2 p-4"
                    name="hamid"
                    description="last message"
                    avatarProps={{
                        src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
                    }}
                />
            </div>

            <div className="">
                <ChatInput />
            </div>
        </div>
    )
}



