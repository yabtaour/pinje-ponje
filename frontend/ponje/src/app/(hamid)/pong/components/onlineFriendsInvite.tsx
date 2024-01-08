import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User } from "../../../types/user";
import { useToast } from "@chakra-ui/react";




export default function OnlineFriendsInvite({ users }: { users: User[] }) {

    const [sentRequests, setSentRequests] = useState<number[]>([]);
    const router = useRouter();
    const toast = useToast();

    const sendGameRequest = async (userid: number) => {
        try {
            let accessToken: string | null = getToken();
            if (!accessToken) {
                console.error('Access token not found in Cookies');
                return;
            }
            router.push('/pong/versusScreen');
            const res = await axios.post('/game/invite', { userId: userid }, {
                headers: {
                    Authorization: accessToken,
                }
            });
            setSentRequests(prevSentRequests => [...prevSentRequests, userid]);
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: "Unable to send game request.",
                status: "error",
                duration: 3000,
                isClosable: true,
            })

        }
    };


    return (
        <div>
            <div className="flex flex-col items-center justify-center">
                <table className="table bg-[#26243f] md:w-3/5 lg:w-3/4">
                    <thead>
                        <tr>
                            <th className="text-lg font-normal text-[#73d3ff]">Play with a friend !!</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td className="text-center text-gray-500 text-2xl pb-8">
                                    None of your friends are online :( <span className="text-lg text-gray-600"> (do you even have any ?) </span>
                                </td>
                            </tr>
                        ) : (
                            users.map((user, index: number) => (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <Image
                                                        src={user?.profile?.avatar ?? "/placeholderuser.jpeg"}
                                                        alt={`Avatar of ${user.username}`}
                                                        className="avatar online"
                                                        width={48}
                                                        height={48}
                                                    />

                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold text-[#4E40F4]">{user.username}</div>
                                                <div className="text-sm opacity-50 text-[#b6b0f8]">{user.rank}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <th>
                                        {sentRequests.includes(user.id) ? (
                                            <button className="btn btn-sm bg-[#23a3c3] btn-primary text-white" disabled>
                                                Pending Invite
                                            </button>
                                        ) : (
                                            <button className="btn btn-sm bg-[#3a3861] text-[#73d3ff]" onClick={() => sendGameRequest(user.id)}>
                                                Invite
                                            </button>
                                        )}
                                    </th>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
