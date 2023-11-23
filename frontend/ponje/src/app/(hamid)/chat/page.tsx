'use client';

// import useSocket from "@/app/hooks/useSocket";
import { useAppSelector } from "@/app/globalRedux/store";
import { User } from "@nextui-org/react";
import ChatInput from "./components/chatInput";



export default function Chat() {

    const token = useAppSelector(state => state?.authReducer?.value?.token)?.replace('Bearer ', '');

    // const { chatSocket } = useSocket();
    // const [messages, setMessages] = useState([]) as any[]
    // const chatSocket = io('http://localhost:3000/chat', {
    //     auth: { token: token }
    // });

    // useEffect(() => {
    //     chatSocket?.on('connect', () => {
    //         console.log('connected');
    //     })
    //     return () => {
    //         chatSocket?.disconnect();
    //     }
    // }, [])
    return (
        <div className="bg-[#151424] h-full  p-0">
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

