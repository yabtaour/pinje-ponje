'use client'

import { useAppSelector } from "@/app/globalRedux/store";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


export type conversationType = {
    id: number,
    name?: string,
    password?: string,
    roomType: string
}




export default function Conversation({ collapsed }: any) {
    // const { chatSocket } = useSocket();

    const token = useAppSelector(state => state?.authReducer?.value?.token)
    const [conversations, setConversations] = useState([]) as any[]
    const chatSocket = io('http://localhost:3000/chat', {
        extraHeaders: {
            Authorization: `${token}`
        }
    })


    useEffect(() => {
        chatSocket?.on('connect', () => {
            console.log('connected');
        })
        return () => {
            console.log('disconnecting');
            chatSocket?.disconnect();
        }
    }, [])



    // useEffect(() => {

    //     // console.log('connecting');
    //     // chatSocket?.on('connect', () => {
    //     //     console.log('connected');
    //     chatSocket?.emit('getRooms', {
    //         skip: 0,
    //         take: 10,
    //     });

    //     console.log('getting rooms');
    //     chatSocket?.on('listOfRooms', (rooms: any[]) => {
    //         console.log(rooms);
    //         setConversations(rooms);
    //     });

    //     return () => {
    //         console.log('disconnecting rooms');
    //         chatSocket?.disconnect();
    //     };

    // }, [conversations])




    return (


        < div className="p-2 sticky top-0" >

            {/* <User className="text-white my-2"

                name={collapsed ? "" : "hamid"}
                description={collapsed ? "" : "last message"}
                avatarProps={{
                    src: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg"
                }}
            /> */}

        </div >



    )

}


