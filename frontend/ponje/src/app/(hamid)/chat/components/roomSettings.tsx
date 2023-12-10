
import { useAppSelector } from '@/app/globalRedux/store';
import { Button, Modal, ModalContent, ScrollShadow, User, useDisclosure } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Yup from 'yup';
import { Ban, Invite, Mute, Play } from './actions';

enum RoomType {
    ROOM = "ROOM",
    DM = "DM"
}




const handleBan = () => {
    console.log("banned");
}

const handleMute = () => {
    console.log("muted");
}

const handlePlay = () => {
    console.log("playing");
}



export function InviteFriends() {
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const me = useAppSelector(state => state?.authReducer?.value?.user);




    return (
        <div className='flex justify-center flex-col'>
            <div className='flex align-middle border border-gray-900 rounded-full px-5 justify-around'>
                {activeConversation?.room?.members.map((member, index) => (
                    <div key={index} className="flex items-center">
                        <User
                            className="text-white my-2"
                            name={
                                activeConversation?.room?.roomType !== "DM"
                                    ? activeConversation?.room?.name
                                    : member?.user?.username
                            }
                            avatarProps={
                                activeConversation?.room?.roomType !== "DM"
                                    ? { src: member?.user?.profile?.avatar }
                                    : { src: "https://i.redd.it/ow1iazp3ob351.jpg" }
                            }
                        />
                        <Invite />
                    </div>
                ))}
            </div>
        </div>
    )

}







export function RoomMembers() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [showInviteFriends, setShowInviteFriends] = useState(false);
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const muted = true;
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
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="" stroke="cyan" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11" />
                        </svg>
                    )
                        : (
                            <p>Invite</p>
                        )
                }
            </Button>
            {/* <InviteFriends isOpen={isOpen} onOpenChange={onOpenChange} /> */}

            <div className=' flex justify-center w-full  p-4'>
                <ScrollShadow hideScrollBar className="w-full h-[40vh]">
                    <div className='flex w-full justify-center bg-[#222038]  flex-col'>
                        {
                            showInviteFriends ? (

                                <div className='flex justify-center'>
                                    <InviteFriends />
                                </div>
                            ) : (
                                <div className='flex justify-center hover:bg-[#252341] rounded-full'>
                                    {activeConversation?.room?.members.map((member, index) => (
                                        <button key={index} className='' onClick={() => { }}>
                                            <User
                                                key={index}
                                                className="text-white my-2 p-4"
                                                name={activeConversation?.room?.roomType !== "DM" ? activeConversation?.room?.name : member?.user?.username}
                                                avatarProps={
                                                    activeConversation?.room?.roomType !== "DM"
                                                        ? { src: member?.user?.profile?.avatar }
                                                        : { src: "https://i.redd.it/ow1iazp3ob351.jpg" }
                                                }
                                            />
                                            {/* //? the ban */}
                                        </button>
                                    ))}

                                    <Ban />
                                    <Mute muted={muted} />
                                    <Play />
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


    const roomType: RoomType = RoomType.ROOM;



    const initialValues = {
        name: '',
        password: '',
        roomType: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        roomType: Yup.string().required('Room Type is required'),
    });

    const handleSubmit = (values: any) => {

        if (values.password === '') {
            delete values.password;
        }
        console.log("values: ", values);
        onOpenChange();
    };

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
                    roomType === RoomType.DM ? (

                        <div className="text-white flex flex-col items-center justify-center bg-[#222039] py-8">
                            <img className='rounded-full w-[10%]' src="https://i.redd.it/ow1iazp3ob351.jpg" alt="" />
                            <h1 className="text-2xl text-cyan-300 font-semibold ">
                                Hamid
                            </h1>
                            <h2>
                                BRONZE
                            </h2>
                            <button
                                className='text-blue-500 rounded-full p-2 '
                                onClick={() => {
                                    {
                                        console.log("clicked");
                                        router.push(`/profile/${2}`);
                                    }
                                }}>
                                Visit Profile
                            </button>

                        </div>

                    ) : (
                        <div className='flex flex-row items-center  justify-around py-12 bg-[#222039]'>
                            <div className="flex flex-col w-1/2  items-center justify-center ">
                                <img
                                    src="/groupChat.svg"
                                    alt="groupChat"
                                    className="w-10 h-10 "
                                ></img>
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
                                                    <option value="public">Public</option>
                                                    <option value="private">Private</option>
                                                    <option value="protected">protected </option>
                                                </Field>
                                                <ErrorMessage name="roomType" component="div" className="text-red-500 text-sm" />
                                            </div>
                                            {values.roomType === 'protected' && (
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
                            </div>
                        </div>

                    )
                }
            </ModalContent>
        </Modal>
    );
}
