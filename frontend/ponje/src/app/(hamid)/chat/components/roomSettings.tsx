'use client';
import { setRooms } from '@/app/globalRedux/features/chatSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import axios from '@/app/utils/axios';
import SocketManager from '@/app/utils/socketManager';
import { useToast } from '@chakra-ui/react';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Modal, ModalContent, ScrollShadow, User, useDisclosure } from '@nextui-org/react';
import { getCookie } from 'cookies-next';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { HashLoader } from 'react-spinners';
import * as Yup from 'yup';
import { Ban, ChangeRole, Invite, Kick, Leave, Mute, Play } from './actions';
const socketManager = SocketManager.getInstance("http://localhost:3000", getCookie('token'));



enum RoomType {
    ROOM = "ROOM",
    DM = "DM"
}




export function RoomSettings({ room, onOpenChange }: { room: any, onOpenChange: () => void }) {


    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const dispatch = useDispatch();
    const toast = useToast();
    const initialValues = {
        name: activeConversation?.room.name,
        password: activeConversation?.room.password,
        roomType: activeConversation?.room.roomType
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required').max(20, 'Name should be less than 20 characters'),
        roomType: Yup.string().required('Room Type is required'),
    });

    const handleSubmit = (values: any) => {

        if (values.password === '' || values.password === undefined || values.password === null) {
            delete values.password;
        }
        axios.put(`chatapi/rooms/${room?.roomId}`, values, {
            headers: {
                authorization: `${getCookie('token')}`
            },

        }).then((res) => {
            const fetchNewMessages = async () => {
                toast({
                    title: "Room Updated.",
                    description: "Room Updated successfully",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                })

                const rooms = await socketManager.getConversations();
                dispatch(setRooms(rooms));
            };
            fetchNewMessages();
        }).catch((err) => {
            toast({
                title: "Error.",
                description: "Error while updating room",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
            console.log(err);
        })

        setAction('');
        onOpenChange();


    };
    return (
        <div className='flex flex-row items-center  justify-around py-12 bg-[#222039]'>
            {
                activeConversation?.role !== "MEMBER" ? (

                    <>

                        <div className="flex flex-col w-1/2  items-center justify-center ">
                            <Image
                                src="/groupChat.svg"
                                alt="groupChat"
                                className="w-10 h-10 "
                            />
                            <h1 className="my-10 text-2xl text-cyan-300 font-semibold ">
                                Room Settings
                            </h1>

                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={handleSubmit}
                            >
                                {({ values }: FormikProps<typeof initialValues>) => (
                                    <Form>


                                        <div className="flex flex-col relative mb-8 p-1">
                                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Name</div>
                                            <Field
                                                name="name"
                                                type="text"
                                                placeholder="Room Name"
                                                className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                            />
                                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="flex flex-col relative mb-8 p-1">
                                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Room Type</div>
                                            <Field
                                                as="select"

                                                name="roomType"
                                                type="text"
                                                placeholder="Room Type"
                                                className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                            >
                                                <option value="">Select Room Type</option>
                                                <option value="PUBLIC">Public</option>
                                                <option value="PRIVATE">Private</option>
                                                <option value="PROTECTED">protected </option>
                                            </Field>
                                            <ErrorMessage name="roomType" component="div" className="text-red-500 text-sm" />
                                        </div>
                                        {values.roomType === 'PROTECTED' && (
                                            <div className="flex flex-col relative mb-8 p-1">
                                                <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Password</div>

                                                <>
                                                    <Field
                                                        name="password"
                                                        type="password"
                                                        placeholder="password"
                                                        className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                                    />
                                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                                </>
                                            </div>
                                        )}
                                        <div className="flex justify-center">

                                            <button
                                                className="mt-4 bg-indigo-600 w-40 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                                                type="submit"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>


                        <div className='text-white w-1/2 '>
                            <RoomMembers />
                            <Leave room={activeConversation} closeModal={onOpenChange} />
                        </div>
                    </>
                ) : (
                    <div className='text-white w-1/2 '>
                        <RoomMembers />
                        <Leave room={activeConversation} closeModal={onOpenChange} />
                    </div>
                )
            }


        </div>
    )
}





export function DmInfo({ user }: { user: any }) {

    const router = useRouter();
    return (
        <div className="border border-gray-700 text-white flex flex-col items-center justify-center bg-[#222039] py-8">
            <Image
                className='rounded-full w-[10%]'
                src={user?.profile?.avatar ? user?.profile?.avatar : "/defaultAvatar.png"}
                alt=""
            />
            <h1 className="text-2xl text-cyan-300 font-semibold ">
                {user?.username}
            </h1>
            <h2>
                {/* should be the rank here  */}
            </h2>
            <button
                className='text-blue-500 rounded-full p-2 '
                onClick={() => {
                    {
                        router.push(`/profile/${user?.id}`);
                    }
                }}>
                Visit Profile
            </button>
            <div className='flex justify-start'>
                <Play member={user} />
                <Ban member={user} />
            </div>

        </div>
    )
}





export function InviteFriends() {
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const [friends = [], setFriends] = useState<any[]>([]);
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    const [isLoading, setLoading] = useState(true);
    const toast = useToast();
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await axios.get(`/users/${me?.id}/friends`);
                setLoading(false);
                setFriends(res.data);
            } catch (err) {
                console.log(err);
                toast({
                    title: "Error.",
                    description: "Error while fetching friends",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                })
            }
        };

        fetchFriends();
    }, [activeConversationId, me , toast]);

    const filteredFriends = friends.filter(friend => {
        return !activeConversation?.room?.members?.some(member => member?.user?.id === friend.id);
    });



    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && friends.length === 0) {
                setLoading(false);
                setFriends([]);
            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [isLoading, friends.length]);


    return (
        <div className='flex justify-center flex-row'>
            <div className='flex flex-col align-middle'>
                {isLoading && friends.length === 0 ? (
                    <HashLoader size={100} color="#2F296E" />
                ) : friends.length === 0 && !isLoading ? (
                    <div className='text-white'>
                        <Image
                            width={200}
                            alt="NextUI hero Image"
                            src="noData.svg"
                        />
                        <h1 className='text-center text-gray-500 m-5 '>No Friends to invite :(</h1>
                    </div>
                ) : (

                    filteredFriends.map((friend, index) => (
                        <div key={index} className="flex m-2 flex-row  hover:bg-[#252341] border border-gray-900 rounded-full px-3 justify-around">
                            <User
                                className="text-white my-2"
                                name={friend?.username}
                                description={friend?.status}
                                avatarProps={{
                                    src: friend.profile?.avatar ?? "/defaultAvatar.png"
                                }}
                            />
                            <Invite friend={friend} room={activeConversation} />
                        </div>
                    ))
                )
                }
            </div>
        </div>
    )
}

const HanldeRoleOptions = ({ member }: { member: any }) => {
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));

    if (activeConversation?.role === "OWNER") {

        return (
            <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
                <DropdownItem key="" ><Mute member={member} /></DropdownItem>
                <DropdownItem key="" className="text-danger" color="danger"><Ban member={member} /></DropdownItem>
                <DropdownItem key="" className="text-danger" color="danger"><Kick member={member} /></DropdownItem>
                <DropdownItem key="" ><Play member={member} /> </DropdownItem>
            </DropdownMenu>
        )
    }
    else if (activeConversation?.role === "ADMIN") {
        if (member?.role === "OWNER") {
            return (
                <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
                    <DropdownItem key="" ><Play member={member} /> </DropdownItem>
                </DropdownMenu>
            )
        }
        else {
            return (
                <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
                    <DropdownItem key="" ><Mute member={member} /></DropdownItem>
                    <DropdownItem key="" className="text-danger" color="danger"><Ban member={member} /></DropdownItem>
                    <DropdownItem key="" className="text-danger" color="danger"><Kick member={member} /></DropdownItem>
                    <DropdownItem key="" ><Play member={member} /> </DropdownItem>
                </DropdownMenu>
            )
        }
    }
    else {
        return (
            <DropdownMenu variant="flat" aria-label="Dropdown menu with shortcut">
                <DropdownItem key="Play" > <Play member={member} /> </DropdownItem>
            </DropdownMenu>
        )
    }

}



export function RoomMembers() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [showInviteFriends, setShowInviteFriends] = useState(false);
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const [muted, setMuted] = useState(false);
    const router = useRouter();

    console.log("activeConversation: ", activeConversation);
    return (
        <div className='w-full  p-4'>
            <h1 className='text-center text-cyan-300'>{
                showInviteFriends ? (
                    <h1 className='text-center text-cyan-300'>Invite Friends</h1>
                ) : (
                    <h1 className='text-center text-cyan-300'>Room Members</h1>
                )
            }</h1>
            <Button className='text-end hover:text-cyan-100  text-cyan-500' onClick={() => { showInviteFriends ? setShowInviteFriends(false) : setShowInviteFriends(true) }}>
                {
                    showInviteFriends ? (
                        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11" />
                        </svg>
                    )
                        : (
                            <svg width="32" height="32" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#fff" d="M892 772h-80v-80c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v80h-80c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h80v80c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-80h80c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8M373.5 498.4c-.9-8.7-1.4-17.5-1.4-26.4c0-15.9 1.5-31.4 4.3-46.5c.7-3.6-1.2-7.3-4.5-8.8c-13.6-6.1-26.1-14.5-36.9-25.1a127.54 127.54 0 0 1-38.7-95.4c.9-32.1 13.8-62.6 36.3-85.6c24.7-25.3 57.9-39.1 93.2-38.7c31.9.3 62.7 12.6 86 34.4c7.9 7.4 14.7 15.6 20.4 24.4c2 3.1 5.9 4.4 9.3 3.2c17.6-6.1 36.2-10.4 55.3-12.4c5.6-.6 8.8-6.6 6.3-11.6c-32.5-64.3-98.9-108.7-175.7-109.9c-110.8-1.7-203.2 89.2-203.2 200c0 62.8 28.9 118.8 74.2 155.5c-31.8 14.7-61.1 35-86.5 60.4c-54.8 54.7-85.8 126.9-87.8 204a8 8 0 0 0 8 8.2h56.1c4.3 0 7.9-3.4 8-7.7c1.9-58 25.4-112.3 66.7-153.5c29.4-29.4 65.4-49.8 104.7-59.7c3.8-1.1 6.4-4.8 5.9-8.8M824 472c0-109.4-87.9-198.3-196.9-200C516.3 270.3 424 361.2 424 472c0 62.8 29 118.8 74.2 155.5a300.95 300.95 0 0 0-86.4 60.4C357 742.6 326 814.8 324 891.8a8 8 0 0 0 8 8.2h56c4.3 0 7.9-3.4 8-7.7c1.9-58 25.4-112.3 66.7-153.5C505.8 695.7 563 672 624 672c110.4 0 200-89.5 200-200m-109.5 90.5C690.3 586.7 658.2 600 624 600s-66.3-13.3-90.5-37.5a127.26 127.26 0 0 1-37.5-91.8c.3-32.8 13.4-64.5 36.3-88c24-24.6 56.1-38.3 90.4-38.7c33.9-.3 66.8 12.9 91 36.6c24.8 24.3 38.4 56.8 38.4 91.4c-.1 34.2-13.4 66.3-37.6 90.5" />
                            </svg>
                        )
                }
            </Button>

            <div className=' flex justify-center w-full  p-4'>
                <ScrollShadow hideScrollBar className="w-full h-[40vh]">
                    <div className='flex w-full justify-center bg-[#222038]  flex-fol'>
                        {
                            showInviteFriends ? (

                                <div className='flex justify-center'>
                                    <InviteFriends />
                                </div>
                            ) : (
                                <div className='w-full '>
                                    {activeConversation?.room?.members?.map((member, index) => (
                                        <div className='flex justify-around'>
                                            <div key={index} className='flex justify-between  w-full rounded-full '>


                                                <button key={index} className='flex justify-between  w-full rounded-full hover:bg-[#252341] ' onClick={() => {
                                                    router.push(`/profile/${member?.user?.id}`)

                                                }}>
                                                    <User
                                                        key={index}
                                                        className="text-white my-3 px-4"
                                                        name={member?.user?.username}
                                                        avatarProps={
                                                            {

                                                                src: member?.user?.profile?.avatar ?? "/defaultAvatar.png"
                                                            }
                                                        }
                                                    />
                                                    {/* role  */}
                                                </button>

                                                {
                                                    activeConversation?.role === 'MEMBER' || (activeConversation?.role === 'OWNER' && activeConversation?.userId === member?.userId || activeConversation?.role === "ADMIN" && member.role === "OWNER") ? (
                                                        <div key={index} className='mr-5 mx-2 flex flex-col justify-center border-cyan-300'>
                                                            <p className='text-cyan-500 border text-sm border-cyan-300 rounded-full p-1'>{member?.role}</p>
                                                        </div>

                                                    ) : (<>
                                                        <ChangeRole member={member} />
                                                    </>)
                                                }
                                            </div >
                                            {
                                                activeConversation?.userId === member?.userId ? (<></>) : (

                                                    <Dropdown className='bg-gray-900 text-white text-sm  w-1/2 rounded-lg'>
                                                        <DropdownTrigger>
                                                            <Button
                                                                variant='bordered'
                                                            >
                                                                <svg width="24" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill="currentColor" d="M256 144a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64m0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32m0 320a64 64 0 1 0 64 64a64.072 64.072 0 0 0-64-64m0 96a32 32 0 1 1 32-32a32.036 32.036 0 0 1-32 32m0-272a64 64 0 1 0 64 64a64.072 64.072 0 0 0-64-64m0 96a32 32 0 1 1 32-32a32.036 32.036 0 0 1-32 32" />
                                                                </svg>
                                                            </Button>
                                                        </DropdownTrigger>
                                                        <HanldeRoleOptions member={member} />
                                                    </Dropdown>
                                                )
                                            }
                                            {/* {
                                                activeConversation.role === "OWNER" ? (
                                                    <ChangeRole member={member} />
                                                ) : (<></>)
                                            } */}

                                        </div>

                                    ))}

                                </div>
                            )
                        }
                    </div>
                </ScrollShadow>
            </div>
        </div >
    );
}




export default function RoomOptions({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {

    const router = useRouter();
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    //TODO : check if user is admin or not

    let member;
    if (activeConversation?.room.roomType === RoomType.DM) {
        member = activeConversation.room.members.find((member: any) => member.user.id !== me?.id);
    }


    return (
        <Modal
            className="max-w-4xl max-h-5xl "
            backdrop='blur'
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            radius="lg"
            classNames={{
                closeButton: 'hidden',
                base: "w-screen",
                backdrop: "bg-gray-900/50",
            }}
        >
            <ModalContent>
                {
                    activeConversation?.room?.roomType === RoomType.DM
                        ? (
                            <DmInfo user={member?.user} />
                        ) : (
                            <RoomSettings room={activeConversation} onOpenChange={onOpenChange} />
                        )
                }
            </ModalContent>
        </Modal>
    );
}
function setAction(arg0: string) {
    throw new Error('Function not implemented.');
}

