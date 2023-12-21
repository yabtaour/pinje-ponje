
'use client';
import { addMember, changeRole, removeMember, setRooms, updateMemberState } from "@/app/globalRedux/features/chatSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import axios from "@/app/utils/axios";
import SocketManager from "@/app/utils/socketManager";
import { useToast } from '@chakra-ui/react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from "@nextui-org/react";

import { getCookie } from "cookies-next";
import { useState } from "react";
import { useDispatch } from "react-redux";


const socketManager = SocketManager.getInstance("http://localhost:3000", getCookie('token'));
// const socketMannager = SocketManager.getInstance()

export function Ban({ member }: { member: any }) {

    const toast = useToast()
    const dispatch = useDispatch()

    const handleBan = async () => {
        const res = await axios.post(`/chatapi/ban`, {
            id: member.roomId,
            userId: member.userId
        },
            {
                headers: {
                    authorization: `${getCookie('token')}`
                }
            }).then((res) => {
                console.log("res: ", res);
                dispatch(updateMemberState({ member, newState: "BANNED" }));
            }
            ).catch((err) => {
                console.log("err: ", err);
            });
    };

    const handleUnban = async () => {
        const res = await axios.post(`/chatapi/unban`, {
            id: member.roomId,
            userId: member.userId
        },
            {
                headers: {
                    authorization: `${getCookie('token')}`
                }
            }).then((res) => {
                console.log("res: ", res);
                dispatch(updateMemberState({ member, newState: "ACTIVE" }));
            }
            ).catch((err) => {
                console.log("err: ", err);
            });
    };




    return (<div className=' p-2 flex flex-col align-middle justify-center '>
        <Button onClick={

            () => {
                member.state === 'BANNED' ? handleUnban() : handleBan();
            }
        } className=" px-4 rounded-full border hover:bg-blue-700/10 border-blue-700/10">
            {
                member.state === 'BANNED' ? (
                    <>
                        <h1 className="px-2">Unban</h1>
                        <svg className='hover:bg-red-500/10' width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path fill="blue" d="M425.706 86.294A240 240 0 0 0 86.294 425.705A240 240 0 0 0 425.706 86.294ZM256 48a207.1 207.1 0 0 1 135.528 50.345L98.345 391.528A207.1 207.1 0 0 1 48 256c0-114.691 93.309-208 208-208Zm0 416a207.084 207.084 0 0 1-134.986-49.887l293.1-293.1A207.084 207.084 0 0 1 464 256c0 114.691-93.309 208-208 208Z" />
                        </svg>
                    </>
                ) : (
                    <>
                        <h1 className="px-2">Ban</h1>
                        <svg className='hover:bg-red-500/10' width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                            <path fill="red" d="M425.706 86.294A240 240 0 0 0 86.294 425.705A240 240 0 0 0 425.706 86.294ZM256 48a207.1 207.1 0 0 1 135.528 50.345L98.345 391.528A207.1 207.1 0 0 1 48 256c0-114.691 93.309-208 208-208Zm0 416a207.084 207.084 0 0 1-134.986-49.887l293.1-293.1A207.084 207.084 0 0 1 464 256c0 114.691-93.309 208-208 208Z" />
                        </svg>

                    </>)
            }
        </Button>
    </div>)
}

export function Mute({ member }: { member: any }) {

    const dispatch = useDispatch();
    const toast = useToast();

    const handleMute = async () => {
        const res = await axios.post(`/chatapi/mute`, {
            id: member.roomId,
            userId: member.userId
        },
            {
                headers: {
                    authorization: `${getCookie('token')}`
                }
            }).then((res) => {
                console.log("res: ", res);
                dispatch(updateMemberState({ member, newState: "MUTED" }));
            }
            ).catch((err) => {
                console.log("err: ", err);
            });
    };


    const handleUnmute = async () => {
        const res = await axios.post(`/chatapi/unmute`, {
            id: member.roomId,
            userId: member.userId
        },
            {
                headers: {
                    authorization: `${getCookie('token')}`
                }
            }).then((res) => {
                console.log("res: ", res);

                dispatch(updateMemberState({ member, newState: "ACTIVE" }));
            }
            ).catch((err) => {
                console.log("err: ", err);
            });


    };


    return (
        <div className=' p-2 flex flex-col align-middle justify-center '>
            <Button onClick={() => {
                member.state === 'MUTED' ? handleUnmute() : handleMute();
            }} className=" px-4 rounded-full border hover:bg-blue-700/10 border-blue-700/10">
                {
                    member.state === 'MUTED' ? (
                        <>
                            <h1 className="px-2">Unmute</h1>
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" d="M17 21a1.06 1.06 0 0 1-.57-.17L10 16.43H5a1 1 0 0 1-1-1V8.57a1 1 0 0 1 1-1h5l6.41-4.4A1 1 0 0 1 18 4v16a1 1 0 0 1-1 1ZM6 14.43h4.33a1 1 0 0 1 .57.17l5.1 3.5V5.9l-5.1 3.5a1 1 0 0 1-.57.17H6Z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            <h1 className="px-2">Mute</h1>
                            <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                <path fill="currentColor" fill-rule="evenodd" d="M1.5 5h2.79l3.86-3.83l.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85L4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732l-.707.707L12.5 9.207l-1.732 1.732l-.707-.707L11.793 8.5L10.06 6.77l.707-.707l1.733 1.73l1.731-1.731z" clip-rule="evenodd" />
                            </svg>
                        </>
                    )
                }
            </Button>
        </div>
    )
}

export function Play({ member }: { member: any }) {
    const dispatch = useDispatch()
    const toast = useToast()


    const handlePlay = () => {

        axios
            .post(`/game/invite`, {
                userId: member?.userId
            },
                {
                    headers: {
                        authorization: `${getCookie('token')}`
                    }
                })
            .then((res) => {
                console.log("res: ", res);
                toast({
                    title: "Invitation sent.",
                    description: "Invitation sent.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })
            })
            .catch((err) => {
                toast({
                    title: "An error occurred.",
                    description: "Unable to invite.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                })
            });
    };


    return (
        <div className='p-2   flex flex-col align-middle justify-center '>
            <Button onClick={handlePlay} className=" px-4 rounded-full border hover:bg-blue-700/10 border-blue-700/10">
                <p className="px-2">Play</p>
                <svg className='hover:fill-blue-500  rounded-full ' width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="m498.03 15.125l-87.06 34.72l-164.5 164.5l-34.657-32.095l31.156-28.844l-223-133.594L176.155 164.5l-31.094 28.813l63.563 58.875l-70.03 70.03a398.93 398.93 0 0 0 8.968 10.438l9.656 9.656l71.5-71.5l13.718 12.688l-72 72l9.843 9.844a405.858 405.858 0 0 0 10.657 9.187l72-72l40.782 37.75l-29 26.876l223 133.594l-158.69-146.97l29-26.842l-67.217-62.282l162.5-162.5l34.718-87.03zm-67.34 53.688l13.218 13.218L280.28 245.657l-13.717-12.687L430.688 68.812zm-341 216.875L61.874 313.5L199.22 450.875l27.81-27.844c-56.283-34.674-103.014-81.617-137.343-137.342zM108.44 386.5l-81 81l17.75 17.75l81-81l-17.75-17.75z" />
                </svg>
            </Button>
        </div>
    )
}

export function Invite({ friend, room }: { friend: any, room: any }) {

    const dispatch = useDispatch()

    const inviteFriend = () => {

        console.log("friend: ", friend);
        console.log("room: ", room);

        axios
            .post(`/chatapi/rooms/${room?.room?.id}/invite`, { id: friend.id }, {
                headers: {
                    authorization: `${getCookie('token')}`
                }
            })
            .then((res) => {
                console.log("res: ", res);
                dispatch(addMember(res.data));




            })
            .catch((err) => {
            });
    };

    return (
        <div className='flex rounded-full flex-col justify-center '>
            <Button onClick={inviteFriend} className=" px-5  border hover:bg-blue-700/10 border-blue-700/10">
                <p className="px-2">Invite</p>
                <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M11.5 12.5H6v-1h5.5V6h1v5.5H18v1h-5.5V18h-1v-5.5Z" />
                </svg>
            </Button>
        </div>
    )
}


export function Join({ room, removeRoom }: { room: any, removeRoom: any }) {
    const dispatch = useDispatch()

    const rooms = useAppSelector((state) => state.chatReducer.rooms);
    const [password, setPassword] = useState('');

    const joinRoom = () => {
        axios
            .post(`/chatapi/rooms/${room.id}/join`, {
                password
            })
            .then((res) => {
                removeRoom(room);
                const fetchNewMessages = async () => {
                    const rooms = await socketManager.getConversations();
                    dispatch(setRooms(rooms));
                };

                fetchNewMessages();
            })
            .catch((err) => {
            });
    };



    return (
        <div className='flex rounded-full flex-col justify-center '>
            {room.roomType === "PROTECTED" && (
                <Input

                    type="password"
                    fullWidth
                    color="primary"
                    size="lg"
                    placeholder="password"
                    className="rounded-full p-1 border border-blue-700/10 hover:bg-blue-700/10"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                />
            )}
            <Button onClick={joinRoom} className=" px-5  border hover:bg-blue-700/10 border-blue-700/10">
                <p className="px-2">Join</p>
                <svg className="" width="24" height="24" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M.5 9.5h9a4 4 0 0 0 0-8h-3" />
                        <path d="m3.5 6.5l-3 3l3 3" />
                    </g>
                </svg>
            </Button>
        </div>

    )
}


export function Leave({ room, closeModal }: { room: any, closeModal: any }) {
    const dispatch = useDispatch()

    const LeaveRoom = () => {

        closeModal();
        axios
            .post(`/chatapi/rooms/${room?.room?.id}/leave`, {
            })
            .then((res) => {
                const fetchNewMessages = async () => {
                    const rooms = await socketManager.getConversations();
                    dispatch(setRooms(rooms));
                };
                fetchNewMessages();
            })
            .catch((err) => {
            });
    };


    return (
        <div className='flex rounded-full flex-col justify-center  '>
            <Button onClick={LeaveRoom} className=" rounded-full px-5  border hover:bg-blue-700/10 border-blue-700/10">
                <h1 className="px-5">Leave</h1>
                <svg width="32" height="32" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <g fill="#fff" fill-rule="#fff" clip-rule="evenodd">
                        <path d="M15.027 7.232a1 1 0 0 1 1.408.128l2.083 2.5a1 1 0 0 1-1.536 1.28l-2.083-2.5a1 1 0 0 1 .128-1.408" />
                        <path d="M15.027 13.768a1 1 0 0 1-.129-1.408l2.084-2.5a1 1 0 1 1 1.536 1.28l-2.083 2.5a1 1 0 0 1-1.408.128" />
                        <path d="M17.5 10.5a1 1 0 0 1-1 1H10a1 1 0 1 1 0-2h6.5a1 1 0 0 1 1 1M3 3.5a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m0 14a1 1 0 0 1 1-1h9a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1" />
                        <path d="M13 2.5a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m0 10a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1m-9-10a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0v-14a1 1 0 0 1 1-1" />
                    </g>
                </svg>
            </Button>
        </div>
    )
}


export function Kick({ member }: { member: any }) {
    const toast = useToast()

    const dispatch = useDispatch()
    const rooms = useAppSelector((state) => state.chatReducer.rooms);
    console.log("room: ", member);
    const KickRoom = () => {
        const toastP = axios
            .post(`/chatapi/kick`,
                {
                    id: member?.roomId,
                    userId: member.userId
                },
                {
                    headers: {
                        authorization: `${getCookie('token')}`
                    }
                })
            .then((res) => {
                dispatch(removeMember(member));
            })
            .catch((err) => {
            });
        toast.promise(toastP, {
            success: { title: 'kicked', description: 'hamid mcha' },
            error: { title: 'errir', description: 'hamid error' },
            loading: { title: 'tsna', description: 'hamid tsna' },
        })
    };

    return (
        <div className='flex rounded-full w-full flex-col justify-center '>
            <Button onClick={() => {
                KickRoom();
            }} className=" rounded-full px-5 w-full border hover:bg-blue-700/10 border-blue-700/10">
                <h1 className="px-5">Kick</h1>
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="currentColor" d="M21 6h-4a1 1 0 0 0 0 2h4a1 1 0 0 0 0-2m-11 5a4 4 0 1 0-4-4a4 4 0 0 0 4 4m0-6a2 2 0 1 1-2 2a2 2 0 0 1 2-2m0 8a7 7 0 0 0-7 7a1 1 0 0 0 2 0a5 5 0 0 1 10 0a1 1 0 0 0 2 0a7 7 0 0 0-7-7" />
                </svg>
            </Button>
        </div>
    )
}

export function ChangeRole({ member }: { member: any }) {
    const toast = useToast()
    const dispatch = useDispatch()
    const handleChangeRole = (role: string) => {

        axios
            .post(`/chatapi/rooms/${member.roomId}/admin`, {
                id: member.userId,
            },
                {
                    headers: {
                        authorization: `${getCookie('token')}`
                    }
                })
            .then((res) => {
                dispatch(changeRole({ member, newState: role }))
            })
            .catch((err) => {
                toast({
                    title: "An error occurred.",
                    description: "Unable to change role.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            });
    }


    return (
        <div className='flex rounded-full flex-col justify-center p-4'>
            <Dropdown className='bg-gray-900 text-white my-5 rounded-lg w-1/2 h-1/3'>
                <DropdownTrigger>
                    <Button variant="bordered">
                        <p className='text-cyan-500 border text-sm border-cyan-300 rounded-full p-1'>{member?.role}</p>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Dropdown menu with shortcut">
                    <DropdownItem
                        className={`hover:bg-[#252341] rounded-full ${member?.role === 'ADMIN' ? 'bg-[#252341]' : ''
                            }`}
                        onClick={() => {
                            handleChangeRole('ADMIN');
                        }}
                        key='ADMIN'
                    >
                        Admin
                    </DropdownItem>
                    <DropdownItem
                        className={`hover:bg-[#252341] rounded-full ${member?.role === 'MEMBER' ? 'bg-[#252341]' : ''
                            }`}
                        onClick={() => {
                            handleChangeRole('MEMBER');
                        }}
                        key='MEMBER'
                    >
                        Member
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </div>
    );
}