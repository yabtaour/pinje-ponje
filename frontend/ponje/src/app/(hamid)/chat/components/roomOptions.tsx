'use client';

import { useAppSelector } from "@/app/globalRedux/store";
import { Button, Card, CardBody, CardHeader, Image, Modal, ModalContent, ScrollShadow, User } from '@nextui-org/react';

import { setRooms } from "@/app/globalRedux/features/chatSlice";
import axios from "@/app/utils/axios";
import SocketManager from "@/app/utils/socketManager";
import { useToast } from "@chakra-ui/react";
import { getCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HashLoader } from "react-spinners";
import * as Yup from 'yup';
import { Join } from "./actions";
const socketManager = SocketManager.getInstance("http://localhost:3000", getCookie('token'));


export function JoinRooms({ onOpenChange, setAction }: { onOpenChange: () => void, setAction: (action: string) => void }) {
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const me = useAppSelector(state => state?.authReducer?.value?.user);
    const [rooms, setRooms] = useState<any[]>([]);
    const [isLoading, setLoading] = useState(true);
    const toast = useToast();



    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const rooms = await axios.get('/chatapi/rooms/list', {
                    headers: {
                        authorization: `${getCookie('token')}`
                    }
                });
                setRooms(rooms.data);
            } catch (err) {
                console.log(err);
                toast({
                    title: "Error.",
                    description: "counldn't fetch rooms.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);





    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isLoading && rooms.length === 0) {
                setLoading(false);

            }
        }, 5000);

        return () => clearTimeout(timeout);
    }, [isLoading]);



    const removeRoom = (room: any) => {
        setRooms(rooms.filter((r: any) => r.id !== room.id));
    }

    return (
        <div className="flex flex-col items-center justify-center bg-[#222039] text-cyan-500 py-8">
            <h1 className="m-5">Rooms you can join</h1>
            <ScrollShadow hideScrollBar className="flex items-center flex-col justify-start w-full h-[50vh]">
                {!isLoading && rooms.length === 0 ? (
                    <div className='text-gray-500 flex flex-col items-center'>
                        <Image
                            className='my-10'
                            width={150}
                            alt="NextUI hero Image"
                            src="noData.svg"
                        />
                        <h1>NO Room UWU</h1>
                    </div>
                ) : rooms.length === 0 && isLoading ? (
                    <div className="flex justify-center">
                        <HashLoader size={100} color="#2F296E" />
                    </div>
                ) : (
                    rooms.map((room, index) => (
                        <div key={index} className="flex justify-between hover:border-gray-300 border w-[50%] border-gray-800 m-2 px-5 rounded-full">
                            <User
                                className="text-white my-2"
                                name={room.name}
                                avatarProps={{ src: "/groups.svg" }}
                            />
                            <Join room={room} removeRoom={removeRoom} />
                        </div>
                    ))
                )}
            </ScrollShadow>
        </div>
    )
}


export function CreateRoom({ onOpenChange, setAction }: { onOpenChange: () => void, setAction: (action: string) => void }) {
    const dispatch = useDispatch();
    const toast = useToast();

    const initialValues = {
        name: '',
        password: '',
        type: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        type: Yup.string().required('Room Type is required'),
    });

    const handleSubmit = (values: any) => {

        if (values.password === '') {
            delete values.password;
        }
        axios.post('chatapi/room', values, {
            headers: {
                authorization: `${getCookie('token')}`
            },

        }).then((res) => {
            const fetchNewMessages = async () => {
                const rooms = await socketManager.getConversations();
                dispatch(setRooms(rooms));
            };
            fetchNewMessages();
        }).catch((err) => {
            toast({
                title: "Error.",
                description: "Counldn't create a room.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            console.log(err);
        })

        setAction('');
        onOpenChange();
    };


    return (
        <div className="flex flex-col items-center justify-center bg-[#222039] py-8">
            <img
                src="/groupChat.svg"
                alt="groupChat"
                className="w-10 h-10 "
            ></img>
            <h1 className="mb-10 text-2xl text-cyan-300 font-semibold ">
                Create a new conversation
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

                                name="type"
                                type="text"
                                placeholder="Room Type"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                            >
                                <option value="">Select Room Type</option>
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                                <option value="PROTECTED">protected </option>
                            </Field>
                            <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                        </div>




                        {values.type === 'PROTECTED' && (
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
                                submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default function RoomOptions({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {


    const [action, setAction] = useState('');

    const handleOnOpenChange = () => {
        onOpenChange();
        setAction('');
    }

    return (
        <Modal
            className="max-w-4xl max-h-5xl "
            backdrop='blur'
            isOpen={isOpen}
            onOpenChange={handleOnOpenChange}
            radius="lg"
            classNames={{
                closeButton: 'hidden',
                base: "w-screen",
                backdrop: "bg-gray-900/50",
            }}
        >
            <ModalContent>
                {
                    action === 'create' ? (<CreateRoom onOpenChange={onOpenChange} setAction={setAction} />) : action === 'join' ? (<JoinRooms onOpenChange={onOpenChange} setAction={setAction} />) : (
                        <div className="flex flex-col items-center justify-center bg-[#222039] py-8">
                            <h1 className="text-cyan-500 "> Please Choose </h1>
                            <div className="flex flex-row items-center ">
                                <Button onClick={() => { setAction('create'); }} >
                                    <Card className="hover:bg-slate-400/10 m-10 rounded-lg  h-full">
                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                            <p className="text-tiny uppercase font-bold text-white">Create a Room</p>

                                            <h4 className="font-bold text-large text-gray-400">Create Your own Room</h4>
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2">
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl"
                                                src="/groups.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </CardBody>
                                    </Card>
                                </Button>
                                <Button onClick={() => { setAction('join'); }} >
                                    <Card className="hover:bg-slate-400/10 m-10 rounded-lg h-full">
                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                            <p className="text-tiny uppercase font-bold text-white">Join the rooms</p>

                                            <h4 className="font-bold text-large text-gray-400">Join Other Roooms</h4>
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2">
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl"
                                                src="/groups.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </CardBody>
                                    </Card>
                                </Button>
                            </div>
                        </div>)
                }

            </ModalContent>
        </Modal>
    );
}
