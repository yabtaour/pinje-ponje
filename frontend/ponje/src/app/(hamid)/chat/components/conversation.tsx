'use client'

import Loader from "@/app/components/loader";
import useSocket from "@/app/hooks/useSocket";
import { useEffect, useState } from "react";




export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}




export default function Conversation({ collapsed }: any) {

    const [conversations, setConversations] = useState<any[]>([] as any[]);
    const socket = useSocket();

    useEffect(() => {
        console.log("connecting to socket");
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

        //         {
        //             conversations?(<Loader />) 
        //             :
        //     (
        //         < div className="p-2 sticky top-0" >

        //             {/* <User className="text-white my-2"

        //                         name={collapsed ? "" : "hamid"}
        //                         description={collapsed ? "" : "last message"}
        //                         avatarProps={{
        //                             src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
        //                         }}
        //                     /> */}

        //         </div >

        //     )


        // }
        <>
            {
                conversations.length === 0 ? (<Loader />) : (
                    <>
                        {
                            conversations.map((conversation: any) => (
                                <div className="p-2 sticky top-0" key={conversation.id}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src="https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="ml-2">
                                                <p className="text-white text-sm font-semibold">{conversation?.name}</p>
                                                <p className="text-gray-400 text-xs font-light">{conversation?.messages
                                                [0]?.content}</p>
                                            </div>
                                        </div>
                                        <div className="text-gray-400 text-xs font-light">
                                            12:45
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                )
            }
        </>
    )

}


//? : the user component 
{/* <User className="text-white my-2"

    name={collapsed ? "" : "hamid"}
    description={collapsed ? "" : "last message"}
    avatarProps={{
        src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
    }}
/> */}