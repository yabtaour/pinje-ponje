'use client';

import { useAppSelector } from "@/app/globalRedux/store";
import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import Image from "next/image";
import bg from '../../../../../public/PlayerBanner.png';
import { User } from '../../../types/user';
import { formatMessageDate } from "../../chat/components/conversation";
import FriendButton from "./FriendButton ";

export default function PlayerBanner({ user }: { user: User | null | undefined }) {

    const logedUserId = useAppSelector((state) => state.authReducer.value.user?.id);
    const username = user?.username;
    const bio = user?.profile?.bio;
    const Avatar = user?.profile?.avatar;

    const handleBlockAction = async (action: "block" | "unblock", userId: number | undefined) => {
        try {
            const token = getToken();
            await axios.post(
                `/users/${action}`,
                {
                    id: userId,
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

        } catch (error) {
            console.error(`Error ${action}ing friend request:`, error);
        } finally {
        }
    };
    return (
        <div className="p-5 flex justify-center flex-row text-center" style={{

            backgroundImage: `url(${bg.src})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: '100%',
        }}>
            <div className=" w-[25rem] flex justify-center flex-col text-center " >
                {
                    Avatar ? (
                        <Image
                            src={Avatar}
                            alt="user image"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] mx-auto m-10 border-2 border-[#77DFF8] rounded-full mb-4"

                        />
                    ) : (
                        <Image
                            src="/placeholderuser.jpeg"
                            alt="user image"
                            width={50}
                            height={50}
                            className="w-[50px] h-[50px] md:w-[100px] md:h-[100px] mx-auto m-10  border-2 border-[#77DFF8] rounded-full mb-4"
                        />
                    )
                }
                <p className="font-medium text-[#77DFF8] mb-2 mt-2">{username}</p>
                <p className=" font-light text-xs md:text-sm text-[#8C8CDA] mb-4">
                    {bio} <span className="text-white"> | </span> <span className="text-[#5b4cff]"> joined {formatMessageDate(user?.createdAt)} </span>
                </p>
                <div>

                    {
                        logedUserId !== user?.id ? (
                            <div className="flex justify-center items-center">
                                <div className="w-[10rem] btn btn-sm btn-active btn-primary">
                                    <FriendButton userId={user?.id} />
                                </div>
                                <div className="dropdown">
                                    <div tabIndex={0} role="button" className="btn btn-square bg-transparent hover:bg-transparent">
                                        <svg tabIndex={0} xmlns="http://www.w3.org/2000/svg" width="4" height="18" viewBox="0 0 4 18" fill="none">
                                            <path d="M2 11C3.10457 11 4 10.1046 4 9C4 7.89543 3.10457 7 2 7C0.89543 7 0 7.89543 0 9C0 10.1046 0.89543 11 2 11Z" fill="#6563FF" />
                                            <path d="M2 4C3.10457 4 4 3.10457 4 2C4 0.89543 3.10457 0 2 0C0.89543 0 0 0.89543 0 2C0 3.10457 0.89543 4 2 4Z" fill="#6563FF" />
                                            <path d="M2 18C3.10457 18 4 17.1046 4 16C4 14.8954 3.10457 14 2 14C0.89543 14 0 14.8954 0 16C0 17.1046 0.89543 18 2 18Z" fill="#6563FF" />
                                        </svg>
                                    </div>
                                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-[#252341]/80 rounded-box w-32">
                                        <li>
                                            <button onClick={() => handleBlockAction("block", user?.id)} className="text-white hover:bg-slate-600 focus:outline-none">
                                                Block
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        ) : (
                            <></>
                        )
                    }
                </div>

            </div>
        </div>
    );
}
