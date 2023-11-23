'use client'

import Loader from "@/app/components/loader";
import { useAppSelector } from "@/app/globalRedux/store";
import useSocket from "@/app/hooks/useSocket";
import { useEffect, useState } from "react";


export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}




export default function Conversation({ collapsed }: any) {

    const [conversations, setConversations] = useState(null) as any[]
    const token = useAppSelector(state => state?.authReducer?.value?.token)?.replace('Brearer ', '');
    const { chatSocket } = useSocket();
    // const chatSocket = io('http://localhost:3000/chat', {
    //     auth: { token: token }
    // });
    
    console.log("chatSocket :", chatSocket);
    useEffect(() => {

        console.log("connecting to socket");
        chatSocket?.on('connect', () => {
            console.log('connected');
        })
        return () => {
            chatSocket?.disconnect();
        }

    }, [])

    useEffect(() => {

        if (chatSocket) {
            chatSocket.emit('getRooms', {
                skip: 0,
                take: 10,
            });
        }

        chatSocket?.on('listOfRooms', (rooms: any[]) => {
            setConversations(rooms);
            console.log(rooms);
        });

        console.log("conversations :", conversations);
        return () => {
            chatSocket?.disconnect();
        };
    }, [conversations]);

    return (
        <Loader />

        // < div className="p-2 sticky top-0" >

        //     {/* <User className="text-white my-2"

        //         name={collapsed ? "" : "hamid"}
        //         description={collapsed ? "" : "last message"}
        //         avatarProps={{
        //             src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
        //         }}
        //     /> */}

        // </div >

    )

}


