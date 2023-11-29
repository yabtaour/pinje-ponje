'use client';
import { useAppSelector } from "@/app/globalRedux/store";
import { ScrollShadow, User } from "@nextui-org/react";




import ChatInput from "./components/chatInput";
import { formatMessageDate } from "./components/conversation";


export function Mymessage({ message }: any) {

    console.log("message: ", message);

    return (
        <div className="flex flex-row justify-end">
            <div className="bg-[#252341] rounded-lg p-2 m-2 max-w-[80%] sm:max-w-[60%] md:max-w-[50%] lg:max-w-[40%]">
                <p className="text-white text-xs sm:text-sm">{message?.content} </p>
                <p className="text-[#999] text-xs sm:text-sm"> {formatMessageDate(message?.createdAt)}</p>
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

export default function Chat() {

    // const globalSocket = useSocketContext();
    const activeConversation = useAppSelector(state => state?.chatReducer?.activeConversation);
    const roooms = useAppSelector(state => state?.chatReducer?.rooms);
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    let messages = activeConversation?.room?.messages;



    // const globalSocket = useSocketIO();
    // console.log("from chat globalSock: ", globalSocket );


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

                                    <div className="bg-[#1B1A2D] w-full rounded-md sticky top-0">
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
                                    </div>

                                    {
                                        (messages ?? []).map((message: any) => (
                                            message?.user?.id === me?.id ? (
                                                <OtherMessage message={message} />
                                            ) : (
                                                <Mymessage message={message} />
                                            )
                                        ))
                                    }

                                </>
                            )

                        }

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




