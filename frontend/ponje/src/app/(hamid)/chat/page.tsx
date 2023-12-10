'use strict';
'use client';
import { useAppSelector } from "@/app/globalRedux/store";
import { Button, ScrollShadow, User, useDisclosure } from "@nextui-org/react";




// import ChatInput from "./components/chatInput";
import SocketManager from "@/app/utils/socketManager";
import { getCookie } from "cookies-next";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import ChatInput from "./components/chatInput";
import { formatMessageDate } from "./components/conversation";
import RoomOptions from "./components/roomSettings";




const spinner = <svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
        <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12" />
    </path>
</svg>


const sent = <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#fff" d="M5.808 16.923q-.213 0-.357-.144q-.143-.144-.143-.357q0-.212.143-.356q.144-.143.357-.143h5.788l-7.55-7.55q-.14-.14-.153-.349t.152-.36q.139-.139.354-.139q.214 0 .355.14L12 14.905l5.046-5.045q-.12-.283-.179-.52q-.06-.238-.06-.439q0-.766.53-1.295t1.294-.53q.765 0 1.298.53q.533.528.533 1.294t-.531 1.298q-.53.533-1.299.533q-.165 0-.377-.047q-.213-.047-.47-.16l-5.381 5.4h5.788q.213 0 .357.143t.143.357q0 .213-.143.356q-.144.143-.357.143H5.808Z" />
</svg>

export function Mymessage({ message }: any) {
    return (
        <div className="flex flex-row justify-end">
            <div className="bg-[#252341] rounded-lg p-2 m-2 max-w-[80%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
                <p className="text-white text-xs sm:text-sm">{message?.content}</p>

                <div className="flex flex-row justify-between">
                    <p className="text-[#999] text-xs sm:text-sm">{formatMessageDate(message?.createdAt)}</p>
                    {message?.status === "pending" ? (
                        <div className="flex justify-end mr-2">{spinner}</div>
                    ) : (
                        <>{sent}</>
                    )}
                </div>
            </div>
            <img
                src={message?.user?.profile?.avatar}
                alt="User Avatar"
                className="w-8 h-8 mt-4 rounded-full"
            />
        </div>
    );
}


export function OtherMessage({ message }: any) {
    return (
        <div className="flex p-3 flex-row justify-start">
            <img src={message?.user?.profile?.avatar} alt="User Avatar" className="w-8 h-8 mt-4 rounded-full" />
            <div className="bg-[#2F296E] rounded-lg p-2 m-2 max-w-[80%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
                <p className="text-white text-xs sm:text-sm">{message?.content} </p>
                <p className="text-[#999] text-xs sm:text-sm" > {formatMessageDate(message?.createdAt)}</p>
            </div>
        </div>
    );
}

export function TemporaryMessage({ message }: any) {
    return (
        <div className="flex p-3 flex-row justify-start">
            <img src={message?.user?.profile?.avatar} alt="User Avatar" className="w-8 h-8 mt-4 rounded-full" />
            <div className="bg-[#2F296E] rounded-lg p-2 m-2 max-w-[80%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
                <p className="text-white text-xs sm:text-sm">{message?.content} </p>
                <p className="text-[#999] text-xs sm:text-sm" > {formatMessageDate(message?.createdAt)}</p>
            </div>
        </div>
    );
}



export default function Chat() {



    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    let messages = activeConversation?.room?.messages;
    const conversations = useAppSelector(state => state?.chatReducer?.rooms);
    const dispatch = useDispatch();
    const token = getCookie("token");
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const socketManager = SocketManager.getInstance("http://localhost:3000", token);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    console.log("activeConversationId: ", activeConversationId);
    console.log("activeConversation: ", activeConversation);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useLayoutEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    };


    useEffect(() => {

        console.log("latest message from chat Page", messages?.slice(-1)[0]);
    }, [conversations, dispatch, socketManager, activeConversation]);



    console.log("messages: ", messages);


    return (
        <div className="bg-[#151424] h-full  p-2 ">
            <div className="">

                <>
                    <ScrollShadow hideScrollBar className=" h-[75vh]">
                        {
                            // activeConversation?.rooms?.messages?.length === 0 || !activeConversation ? (
                            messages?.length === 0 || !activeConversation ? (
                                <>
                                    <img src="/empty_chat.svg" alt="hero" className="w-full h-full m- rounded-full" />
                                </>

                            ) : (

                                <>

                                    <div className=" flex justify-center   sticky top-0">
                                        <div className="lg:w-1/3 md:2/3 bg-[#1B1A2D] sm:w-full  rounded-b-full hover:bg-[#252341] flex justify-center ">
                                            <Button onPress={onOpen} >
                                                <User
                                                    className="text-white my-2 p-4"
                                                    name={activeConversation?.room?.roomType !== "DM" ? activeConversation?.room?.name : activeConversation?.room?.members[0]?.user?.username}
                                                    avatarProps={
                                                        activeConversation?.room?.roomType !== "DM"
                                                            ?
                                                            { src: activeConversation?.room?.members[0]?.user?.profile?.avatar }
                                                            :
                                                            { src: "https://i.redd.it/ow1iazp3ob351.jpg" }
                                                    }
                                                />
                                            </Button>
                                            <RoomOptions  isOpen={isOpen} onOpenChange={onOpenChange} />
                                        </div>
                                    </div>

                                    {
                                        (messages ?? []).map((message: any) => (
                                            message?.user?.id === me?.id ? (
                                                <Mymessage message={message} />
                                            ) : (
                                                <OtherMessage message={message} />
                                            )
                                        ))
                                    }

                                </>
                            )

                        }

                        <div ref={messagesEndRef} />
                    </ScrollShadow>

                </>
                {
                    messages?.length === 0 || !activeConversation ? (
                        <></>
                    ) : (
                        <div className="w-2/3">
                            <ChatInput />
                        </div>
                    )
                }
            </div>
        </div>
    )
}




